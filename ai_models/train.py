import os
import sys
import shutil
import time
import yaml
import pandas as pd
from pathlib import Path
from colorama import init, Fore, Style

import torch
from ultralytics import YOLO
import config

init(autoreset=True)

def print_header(text: str):
    """Prints a styled header to the console."""
    print(Fore.CYAN + Style.BRIGHT + "="*60)
    print(Fore.CYAN + Style.BRIGHT + f" {text}")
    print(Fore.CYAN + Style.BRIGHT + "="*60)

def verify_gpu():
    """Verifies CUDA availability and prints GPU statistics."""
    print_header("1. GPU Verification")
    if not torch.cuda.is_available():
        raise Exception("CUDA GPU not found. Training requires NVIDIA GPU.")
        
    device_id = config.DEVICE
    gpu_name = torch.cuda.get_device_name(device_id)
    cuda_version = torch.version.cuda
    torch_version = torch.__version__
    
    # Memory capacity
    total_memory = torch.cuda.get_device_properties(device_id).total_memory / (1024**3)
    allocated_memory = torch.cuda.memory_allocated(device_id) / (1024**3)
    
    print(Fore.GREEN + f"[*] GPU Name: {gpu_name}")
    print(Fore.GREEN + f"[*] CUDA Version: {cuda_version}")
    print(Fore.GREEN + f"[*] Torch Version: {torch_version}")
    print(Fore.GREEN + f"[*] Device ID: {device_id}")
    print(Fore.GREEN + f"[*] Available GPU Memory: {total_memory:.2f} GB")
    print(Fore.GREEN + f"[*] Current GPU Memory: {allocated_memory:.2f} GB\n")

def verify_dataset():
    """Verifies the integrity of the dataset, matching images and labels."""
    print_header("2. Dataset Integrity Verification")
    if not config.YAML_PATH.exists():
        raise FileNotFoundError(f"Missing data.yaml at {config.YAML_PATH}")
        
    with open(config.YAML_PATH, 'r') as f:
        data = yaml.safe_load(f)
        
    names = data.get('names', {})
    print(Fore.YELLOW + f"Total classes defined in data.yaml: {len(names)}")
    
    class_dist = {i: 0 for i in range(len(names))}
    
    def check_split(split_name: str) -> int:
        split_path = config.DATASET_DIR / split_name
        if not split_path.exists():
            return 0
        img_dir = split_path / 'images'
        lbl_dir = split_path / 'labels'
        
        if not img_dir.exists() or not lbl_dir.exists():
            return 0
            
        count = 0
        for img_file in img_dir.iterdir():
            if img_file.is_file():
                lbl_file = lbl_dir / f"{img_file.stem}.txt"
                if not lbl_file.exists():
                    raise Exception(f"Missing label for {img_file.name}")
                # Validate YOLO label structure
                with open(lbl_file, 'r') as lf:
                    for line in lf:
                        parts = line.strip().split()
                        if len(parts) >= 5:
                            try:
                                cls_id = int(parts[0])
                                if cls_id in class_dist:
                                    class_dist[cls_id] += 1
                                else:
                                    raise Exception(f"Invalid class ID {cls_id} in {lbl_file}")
                            except ValueError:
                                raise Exception(f"Corrupted label formatting in {lbl_file}: {line}")
                        elif line.strip():
                            raise Exception(f"Corrupted label in {lbl_file}: {line}")
                count += 1
        return count

    print(Fore.CYAN + "Verifying 'train' split...")
    total_train = check_split('train')
    print(Fore.CYAN + "Verifying 'valid' split...")
    total_valid = check_split('valid')
    print(Fore.CYAN + "Verifying 'test' split...")
    total_test = check_split('test')
    
    print(Fore.GREEN + f"[*] Total train images: {total_train}")
    print(Fore.GREEN + f"[*] Total validation images: {total_valid}")
    print(Fore.GREEN + f"[*] Total test images: {total_test}")
    print(Fore.GREEN + f"[*] Total classes: {len(names)}")
    
    print_header("Class Distribution")
    for cls_id, count in class_dist.items():
        cls_name = names.get(cls_id, f"Class {cls_id}")
        print(f" - {cls_name}: {count} instances")
    print("\nDataset verified successfully. No missing or corrupted labels found.\n")

def get_best_metrics(run_dir: Path):
    """Extracts the best validation metrics from the Ultralytics results.csv."""
    csv_path = run_dir / "results.csv"
    if not csv_path.exists():
        return None
    try:
        df = pd.read_csv(csv_path)
        df.columns = df.columns.str.strip()
        # Find best epoch based on mAP50-95
        best_idx = df['metrics/mAP50-95(B)'].idxmax()
        best_row = df.iloc[best_idx]
        return {
            'best_epoch': int(best_row['epoch']),
            'total_epochs': len(df),
            'precision': best_row['metrics/precision(B)'],
            'recall': best_row['metrics/recall(B)'],
            'mAP50': best_row['metrics/mAP50(B)'],
            'mAP50-95': best_row['metrics/mAP50-95(B)']
        }
    except Exception as e:
        print(Fore.YELLOW + f"Warning: Could not parse results.csv: {e}")
        return None

def train_model():
    """Initializes training with fault tolerance for CUDA OOM errors."""
    print_header("3. Initialization & Training")
    
    # Model instantiation automatically downloads the weights if unavailable
    model = YOLO(config.MODEL_NAME) 
    
    batch_sizes = [config.INITIAL_BATCH_SIZE] + config.OOM_RETRY_BATCH_SIZES
    workers = 2 # Hardcoded to 2 to prevent WinError 1455 Memory Crash
    
    for batch in batch_sizes:
        print(Fore.CYAN + f"[*] Starting training with batch size: {batch}")
        try:
            start_time = time.time()
            
            # Note: Ultralytics natively manages beautiful, rich console progress bars,
            # prints live training outputs (Epochs, Box Loss, etc.), and generates 
            # TensorBoard logs and plots.
            model.train(
                data=str(config.YAML_PATH),
                epochs=config.EPOCHS,
                imgsz=config.IMAGE_SIZE,
                batch=batch,
                patience=config.PATIENCE,
                project=str(config.RUNS_DIR),
                name=config.EXPERIMENT_NAME,
                seed=config.SEED,
                device=config.DEVICE,
                amp=config.AMP,
                cache=config.CACHE,
                workers=workers,
                save=True,
                save_period=-1 if not config.SAVE_EVERY_EPOCH else 1,
                verbose=config.VERBOSE,
                plots=config.PLOTS,
                exist_ok=True
            )
            
            end_time = time.time()
            
            # Post-training artifact management
            run_dir = config.RUNS_DIR / config.EXPERIMENT_NAME
            weights_dir = run_dir / "weights"
            best_pt = weights_dir / "best.pt"
            last_pt = weights_dir / "last.pt"
            
            if best_pt.exists():
                shutil.copy2(best_pt, config.MODELS_DIR / "best.pt")
            if last_pt.exists():
                shutil.copy2(last_pt, config.MODELS_DIR / "last.pt")
                
            metrics = get_best_metrics(run_dir)
            
            print_header("Training Completed Successfully")
            if metrics:
                print(Fore.GREEN + f"Best Epoch: {metrics['best_epoch']}")
                print(Fore.GREEN + f"Total Epochs: {metrics['total_epochs']}")
                print(Fore.GREEN + f"Precision: {metrics['precision']:.4f}")
                print(Fore.GREEN + f"Recall: {metrics['recall']:.4f}")
                print(Fore.GREEN + f"mAP50: {metrics['mAP50']:.4f}")
                print(Fore.GREEN + f"mAP50-95: {metrics['mAP50-95']:.4f}")
                
            hours, rem = divmod(end_time - start_time, 3600)
            minutes, seconds = divmod(rem, 60)
            print(Fore.GREEN + f"Training Time: {int(hours)}h {int(minutes)}m {int(seconds)}s")
            
            print(Fore.CYAN + f"\nBest Model Path: {config.MODELS_DIR / 'best.pt'}")
            print(Fore.CYAN + f"Last Model Path: {config.MODELS_DIR / 'last.pt'}")
            
            break # Success, exit OOM retry loop
            
        except RuntimeError as e:
            if "CUDA out of memory" in str(e) or "OOM" in str(e):
                print(Fore.RED + f"\n[!] CUDA Out of Memory with batch size {batch}.")
                torch.cuda.empty_cache()
                if batch == batch_sizes[-1]:
                    raise RuntimeError("CUDA Out Of Memory even with smallest batch size.")
                print(Fore.YELLOW + "Retrying with smaller batch size...\n")
            else:
                raise e

def main():
    try:
        verify_gpu()
        verify_dataset()
        train_model()
    except KeyboardInterrupt:
        print(Fore.RED + "\n[!] Training interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(Fore.RED + f"\n[!] Error during training: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
