"""
Project Configuration
Holds all configurable parameters for the Animal Detection YOLO11 project.
"""
import os
from pathlib import Path

# ==========================================
# PATHS
# ==========================================
BASE_DIR = Path(__file__).parent.resolve()
DATASET_DIR = BASE_DIR / "animal_detection_dataset"
YAML_PATH = DATASET_DIR / "data.yaml"

MODELS_DIR = BASE_DIR / "models"
PREDICTIONS_DIR = BASE_DIR / "predictions"
LOGS_DIR = BASE_DIR / "logs"
RUNS_DIR = BASE_DIR / "runs"

# Ensure directories exist
for d in [MODELS_DIR, PREDICTIONS_DIR, LOGS_DIR, RUNS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# ==========================================
# TRAINING PARAMETERS
# ==========================================
MODEL_NAME = "yolo11m.pt"
EPOCHS = 50
IMAGE_SIZE = 640
INITIAL_BATCH_SIZE = 8
OOM_RETRY_BATCH_SIZES = [4, 2]

PATIENCE = 10
PROJECT_NAME = "runs"
EXPERIMENT_NAME = "animal_detection"
SEED = 42

# Automatically detect workers can be done inside train.py using os.cpu_count()
# Optimizer auto, LR default handled by Ultralytics when not specified.

# ==========================================
# DEVICE & OPTIMIZATION
# ==========================================
DEVICE = 0         # NVIDIA GPU ID
AMP = True         # Automatic Mixed Precision
CACHE = True       # Cache dataset in RAM/disk

# ==========================================
# CHECKPOINTING & LOGGING
# ==========================================
SAVE_BEST_MODEL = True
SAVE_LAST_MODEL = True
SAVE_EVERY_EPOCH = False
VERBOSE = True
PLOTS = True
