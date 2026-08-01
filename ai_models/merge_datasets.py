"""
Dataset Merge Utility for YOLO11
This script merges multiple YOLO datasets into a single dataset.
"""

import os
import shutil
import cv2
import yaml
import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from sklearn.model_selection import train_test_split
from tqdm import tqdm
import multiprocessing

# Configuration Constants
BASE_DIR = Path("e:/TETRA043/ai_models")
DATASET_DIR = BASE_DIR / "dataset"
OUTPUT_DIR = BASE_DIR / "animal_detection_dataset"
LOG_FILE = BASE_DIR / "merge_log.txt"

CLASS_MAPPING = {
    "wild_boar": 0,
    "nilgai": 1,
    "cow": 2,
    "buffalo": 3,
    "goat": 4,
    "monkey": 5,
    "dog": 6,
    "peacock": 7,
    "deer": 8
}

SUPPORTED_IMAGE_FORMATS = {'.jpg', '.jpeg', '.png', '.bmp', '.webp'}

def get_items(split_path: Path) -> list:
    """
    Retrieve all valid image and label pairs from a dataset split directory.
    
    Args:
        split_path (Path): Path to the dataset split (e.g. train, valid, test).
        
    Returns:
        list: A list of dictionaries containing paths to 'image' and 'label'.
    """
    images_dir = split_path / 'images'
    labels_dir = split_path / 'labels'
    items = []
    
    if not images_dir.exists():
        return items
        
    for img_path in images_dir.iterdir():
        if img_path.is_file() and img_path.suffix.lower() in SUPPORTED_IMAGE_FORMATS:
            label_path = labels_dir / (img_path.stem + '.txt')
            items.append({
                'image': img_path,
                'label': label_path
            })
    return items

def process_file_task(task_def: dict) -> dict:
    """
    Process a single image and label file. Validates the image and label,
    updates the class ID, renames the files, and copies them to the destination.
    
    Args:
        task_def (dict): A dictionary containing task definitions such as item, split, class_id, etc.
        
    Returns:
        dict: Status of the processing along with metadata for logging.
    """
    item = task_def['item']
    split = task_def['split']
    class_id = task_def['class_id']
    prefix = task_def['prefix']
    counter = task_def['counter']
    
    img_path = item['image']
    label_path = item['label']
    
    # Data Validation
    if not img_path.exists():
        return {'status': 'skip', 'reason': 'missing_image', 'item': item, 'class_name': prefix}
    if not label_path.exists():
        return {'status': 'skip', 'reason': 'missing_label', 'item': item, 'class_name': prefix}
        
    # Check if image is readable
    img = cv2.imread(str(img_path))
    if img is None:
        return {'status': 'skip', 'reason': 'corrupt_image', 'item': item, 'class_name': prefix}
        
    try:
        with open(label_path, 'r') as f:
            lines = f.readlines()
            
        if not lines:
            # Skip images without labels (empty label file)
            return {'status': 'skip', 'reason': 'missing_label', 'item': item, 'class_name': prefix}
            
        valid_lines = []
        for line in lines:
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            if len(parts) >= 5:
                try:
                    # Validate that parts are numeric
                    float(parts[1])
                    # Update class ID (first token)
                    parts[0] = str(class_id)
                    valid_lines.append(" ".join(parts))
                except ValueError:
                    return {'status': 'skip', 'reason': 'corrupt_label', 'item': item, 'class_name': prefix}
            else:
                return {'status': 'skip', 'reason': 'corrupt_label', 'item': item, 'class_name': prefix}
        
        if not valid_lines:
            return {'status': 'skip', 'reason': 'missing_label', 'item': item, 'class_name': prefix}
            
    except Exception as e:
        return {'status': 'skip', 'reason': 'corrupt_label', 'item': item, 'class_name': prefix}
        
    # Copy and transform
    new_stem = f"{prefix}_{counter:06d}"
    dest_img = OUTPUT_DIR / split / 'images' / f"{new_stem}{img_path.suffix}"
    dest_label = OUTPUT_DIR / split / 'labels' / f"{new_stem}.txt"
    
    # Do not overwrite existing files (rule 3)
    if dest_img.exists() or dest_label.exists():
        return {'status': 'skip', 'reason': 'file_exists', 'item': item, 'class_name': prefix}
    
    dest_img.parent.mkdir(parents=True, exist_ok=True)
    dest_label.parent.mkdir(parents=True, exist_ok=True)
    
    shutil.copy2(img_path, dest_img)
    
    with open(dest_label, 'w') as f:
        f.write("\n".join(valid_lines) + "\n")
        
    return {
        'status': 'success',
        'split': split,
        'class_name': prefix
    }

def create_yaml() -> None:
    """
    Automatically generate the data.yaml configuration file for YOLO11.
    """
    yaml_content = {
        'train': 'train/images',
        'val': 'valid/images',
        'test': 'test/images',
        'nc': len(CLASS_MAPPING),
        'names': {v: k for k, v in CLASS_MAPPING.items()}
    }
    
    yaml_path = OUTPUT_DIR / 'data.yaml'
    with open(yaml_path, 'w') as f:
        yaml.dump(yaml_content, f, sort_keys=False)

def main() -> None:
    """
    Main function to execute the dataset merging process.
    Reads datasets, prepares splits, copies files concurrently,
    generates configuration, and outputs statistics.
    """
    start_time = time.time()
    
    tasks = []
    
    for animal, class_id in CLASS_MAPPING.items():
        dataset_path = DATASET_DIR / animal
        if not dataset_path.exists():
            continue
            
        items = {'train': [], 'valid': [], 'test': []}
        for split in ['train', 'valid', 'test']:
            items[split] = get_items(dataset_path / split)
            
        has_train = len(items['train']) > 0
        has_valid = len(items['valid']) > 0
        has_test = len(items['test']) > 0
        
        final_items = {'train': [], 'valid': [], 'test': []}
        
        # Split logic
        if has_train and has_valid and has_test:
            final_items['train'] = items['train']
            final_items['valid'] = items['valid']
            final_items['test'] = items['test']
        elif has_train and has_valid and not has_test:
            if len(items['train']) > 1:
                tr, te = train_test_split(items['train'], test_size=0.1, random_state=42)
                final_items['train'] = tr
                final_items['valid'] = items['valid']
                final_items['test'] = te
            else:
                final_items['train'] = items['train']
                final_items['valid'] = items['valid']
        elif has_train and not has_valid and not has_test:
            if len(items['train']) > 2:
                tr, temp = train_test_split(items['train'], test_size=0.2, random_state=42)
                if len(temp) > 1:
                    val, te = train_test_split(temp, test_size=0.5, random_state=42)
                else:
                    val, te = temp, []
                final_items['train'] = tr
                final_items['valid'] = val
                final_items['test'] = te
            else:
                final_items['train'] = items['train']
        else:
            final_items['train'] = items['train']
            final_items['valid'] = items['valid']
            final_items['test'] = items['test']
            
        animal_counter = 1
        for split, split_items in final_items.items():
            for item in split_items:
                tasks.append({
                    'item': item,
                    'split': split,
                    'class_id': class_id,
                    'prefix': animal,
                    'counter': animal_counter
                })
                animal_counter += 1
                
    if not tasks:
        print("No files found to process. Please check dataset directory.")
        return
        
    # Statistics
    stats = {
        'images_copied': 0,
        'labels_copied': 0,
        'missing_labels': 0,
        'missing_images': 0,
        'skipped_files': 0,
        'train_count': 0,
        'valid_count': 0,
        'test_count': 0,
        'per_class': {animal: 0 for animal in CLASS_MAPPING.keys()}
    }
    
    num_cores = multiprocessing.cpu_count()
    
    with ThreadPoolExecutor(max_workers=num_cores) as executor:
        futures = {executor.submit(process_file_task, task): task for task in tasks}
        
        for future in tqdm(as_completed(futures), total=len(futures), desc="Merging Datasets"):
            result = future.result()
            if result['status'] == 'success':
                stats['images_copied'] += 1
                stats['labels_copied'] += 1
                stats['per_class'][result['class_name']] += 1
                
                if result['split'] == 'train':
                    stats['train_count'] += 1
                elif result['split'] == 'valid':
                    stats['valid_count'] += 1
                elif result['split'] == 'test':
                    stats['test_count'] += 1
            else:
                stats['skipped_files'] += 1
                reason = result['reason']
                if reason == 'missing_label':
                    stats['missing_labels'] += 1
                elif reason == 'missing_image':
                    stats['missing_images'] += 1
                    
    # Create YAML
    create_yaml()
    
    # Write Log
    try:
        with open(LOG_FILE, 'w') as log_f:
            log_f.write(f"Number of images copied: {stats['images_copied']}\n")
            log_f.write(f"Number of labels copied: {stats['labels_copied']}\n")
            log_f.write(f"Missing labels: {stats['missing_labels']}\n")
            log_f.write(f"Missing images: {stats['missing_images']}\n")
            log_f.write(f"Skipped files: {stats['skipped_files']}\n")
            log_f.write(f"Train count: {stats['train_count']}\n")
            log_f.write(f"Validation count: {stats['valid_count']}\n")
            log_f.write(f"Test count: {stats['test_count']}\n")
            log_f.write("Per-class statistics:\n")
            for animal, count in stats['per_class'].items():
                log_f.write(f"- {animal}: {count}\n")
    except Exception as e:
        print(f"Warning: Could not write to log file. {e}")
        
    # Execution Summary
    execution_time = time.time() - start_time
    
    print("Total Images:", stats['images_copied'])
    print("Total Labels:", stats['labels_copied'])
    print("Train Images:", stats['train_count'])
    print("Validation Images:", stats['valid_count'])
    print("Test Images:", stats['test_count'])
    print("Per-class counts:")
    for animal, count in stats['per_class'].items():
        print(f"{animal}: {count}")
    print(f"Total execution time: {execution_time:.2f} seconds")
    print("Dataset merged successfully and ready for YOLO11 training.")

if __name__ == "__main__":
    main()
