import sys
from pathlib import Path
from colorama import init, Fore, Style
from ultralytics import YOLO
import config

init(autoreset=True)

def evaluate():
    """
    Evaluates the trained YOLO11 model on the test dataset.
    Generates confusion matrix, PR curves, and outputs detailed per-class metrics.
    """
    model_path = config.MODELS_DIR / "best.pt"
    if not model_path.exists():
        print(Fore.RED + f"[!] Model not found at {model_path}. Please run train.py first.")
        sys.exit(1)
        
    print(Fore.CYAN + Style.BRIGHT + "="*60)
    print(Fore.CYAN + Style.BRIGHT + f" Animal Detection Evaluation")
    print(Fore.CYAN + Style.BRIGHT + "="*60)
    print(Fore.GREEN + f"[*] Loading model from {model_path}")
    
    model = YOLO(str(model_path))
    
    print(Fore.CYAN + f"\n[*] Starting validation on the 'test' split...")
    
    # Model evaluation on the 'test' split automatically computes standard metrics.
    # Setting plots=True forces the generation of Confusion Matrix, PR curve, F1 curve.
    metrics = model.val(
        data=str(config.YAML_PATH),
        split='test',
        project=str(config.RUNS_DIR),
        name="val_test",
        exist_ok=True,
        plots=True
    )
    
    # Extract overall metrics
    precision = metrics.results_dict.get('metrics/precision(B)', 0.0)
    recall = metrics.results_dict.get('metrics/recall(B)', 0.0)
    map50 = metrics.results_dict.get('metrics/mAP50(B)', 0.0)
    map50_95 = metrics.results_dict.get('metrics/mAP50-95(B)', 0.0)
    
    print(Fore.CYAN + Style.BRIGHT + "\n" + "="*40)
    print(Fore.CYAN + Style.BRIGHT + " Overall Test Metrics")
    print(Fore.CYAN + Style.BRIGHT + "="*40)
    print(Fore.GREEN + f"[*] Precision: {precision:.4f}")
    print(Fore.GREEN + f"[*] Recall:    {recall:.4f}")
    print(Fore.GREEN + f"[*] mAP50:     {map50:.4f}")
    print(Fore.GREEN + f"[*] mAP50-95:  {map50_95:.4f}")
    
    print(Fore.CYAN + Style.BRIGHT + "\n" + "="*40)
    print(Fore.CYAN + Style.BRIGHT + " Per Class Metrics")
    print(Fore.CYAN + Style.BRIGHT + "="*40)
    
    # Extracting per-class statistics from the Ultralytics metrics object
    class_indices = metrics.ap_class_index
    for i, cls_idx in enumerate(class_indices):
        cls_name = model.names[cls_idx]
        
        # class_result() typically returns a tuple with (p, r, ap50, ap50_95)
        res = metrics.class_result(i)
        p = res[0]
        r = res[1]
        ap50 = res[2]
        ap50_95 = res[3]
        
        print(Fore.YELLOW + f"- {cls_name}:")
        print(f"    Precision: {p:.4f} | Recall: {r:.4f} | mAP50: {ap50:.4f} | mAP50-95: {ap50_95:.4f}")
        
    run_path = config.RUNS_DIR / "val_test"
    print(Fore.CYAN + Style.BRIGHT + "\n" + "="*40)
    print(Fore.CYAN + Style.BRIGHT + " Generated Artifacts")
    print(Fore.CYAN + Style.BRIGHT + "="*40)
    print(Fore.GREEN + f"[*] Confusion Matrix: {run_path / 'confusion_matrix.png'}")
    print(Fore.GREEN + f"[*] PR Curve:         {run_path / 'PR_curve.png'}")
    print(Fore.GREEN + f"[*] F1 Curve:         {run_path / 'F1_curve.png'}")
    print(Fore.CYAN + "\n[*] Evaluation complete.")

if __name__ == "__main__":
    try:
        evaluate()
    except KeyboardInterrupt:
        print(Fore.RED + "\n[!] Evaluation interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(Fore.RED + f"\n[!] Error during evaluation: {e}")
        sys.exit(1)
