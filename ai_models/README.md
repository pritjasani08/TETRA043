# Animal Detection System

A production-ready YOLO11-based object detection system designed to identify 9 distinct animal classes.

## Features
- Automated CUDA GPU verification and detailed memory metrics.
- Seamless Out-Of-Memory (OOM) batch size degradation (retries).
- Comprehensive pre-training dataset integrity validation.
- End-to-end model training, prediction, and evaluation workflows.

## Requirements & Installation
1. Install NVIDIA CUDA drivers (**CUDA GPU is Required**).
2. Ensure you are using Python 3.11.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Project Structure
- `animal_detection_dataset/`: Original multi-split dataset (Contains images, labels, and data.yaml).
- `models/`: Stores `best.pt` and `last.pt` outputs after successful training.
- `predictions/`: Stores output bounding box images and videos from prediction runs.
- `runs/`: Contains Ultralytics-native training artifacts, TensorBoard logs, evaluation curves, and raw results.
- `config.py`: Global configuration parameters controlling everything from image size to model behavior.
- `train.py`: Primary training script implementing the GPU verification, dataset validation logic, and YOLO fallback training.
- `predict.py`: Standalone CLI inference handler.
- `evaluate.py`: Standalone CLI testing script to compute dataset metrics natively on the test set.

## Dataset Structure
The built-in dataset relies strictly on standard YOLO format:
- 9 distinct animal classes (0: wild_boar to 8: deer).
- Segregated into `train/`, `valid/`, and `test/` splits.
- All configurations automatically parsed from `animal_detection_dataset/data.yaml`.

## Usage

### 1. Training
Initiate the complete end-to-end training pipeline. It verifies the GPU, validates the dataset integrity, and automatically trains YOLO11 on the default settings (`yolo11m.pt`, Batch Size 8).
```bash
python train.py
```
> Note: If CUDA Out Of Memory is detected, the script automatically retries with progressively smaller batch sizes (4, then 2).

### 2. Prediction
Run inference using the natively exported `best.pt` model. Supports single images, directory trees, videos, or webcam input dynamically.
```bash
python predict.py --source /path/to/image_or_video
# Or for webcam mapping:
python predict.py --source 0
```

### 3. Evaluation
Evaluate the `best.pt` model strictly against the `test` split. Automatically dumps Precision, Recall, mAP stats natively mapped with generated curve plots (PR Curve, F1 Curve, Confusion Matrix).
```bash
python evaluate.py
```
