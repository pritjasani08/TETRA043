import argparse
import sys
from pathlib import Path
from colorama import init, Fore, Style
from ultralytics import YOLO
import config

init(autoreset=True)

def run_inference(source: str):
    """
    Runs YOLO11 inference on the given source (Image, Folder, Video, Webcam).
    Prints detailed detection metrics and saves the annotated outputs.
    """
    model_path = config.MODELS_DIR / "best.pt"
    if not model_path.exists():
        print(Fore.RED + f"[!] Model not found at {model_path}. Please run train.py first.")
        sys.exit(1)
        
    print(Fore.CYAN + Style.BRIGHT + "="*60)
    print(Fore.CYAN + Style.BRIGHT + f" Animal Detection Inference")
    print(Fore.CYAN + Style.BRIGHT + "="*60)
    print(Fore.GREEN + f"[*] Loading model from {model_path}")
    
    model = YOLO(str(model_path))
    
    print(Fore.GREEN + f"[*] Running inference on source: {source}\n")
    
    # YOLO.predict automatically detects input type (folder, video, image, webcam)
    # and processes them accordingly.
    results = model.predict(
        source=source,
        project=str(config.PREDICTIONS_DIR),
        name="predict",
        exist_ok=True,
        save=True,       # Save annotated images/videos
        show=False,      # Set to True to display webcam stream or video live
        conf=0.25
    )
    
    for result in results:
        file_name = Path(result.path).name if result.path else "Stream/Webcam"
        print(Fore.CYAN + "\n" + "-"*50)
        print(Fore.CYAN + f" Results for: {file_name}")
        print(Fore.CYAN + "-"*50)
        
        # Display Inference Time
        inference_time = result.speed.get('inference', 0.0)
        print(Fore.GREEN + f"[*] Inference Time: {inference_time:.2f} ms")
        
        boxes = result.boxes
        if len(boxes) == 0:
            print(Fore.YELLOW + "[-] No animals detected in this frame/image.")
            continue
            
        # Display Animal Name, Confidence, Bounding Box
        for i, box in enumerate(boxes):
            cls_id = int(box.cls[0].item())
            cls_name = model.names[cls_id]
            conf = box.conf[0].item()
            xyxy = box.xyxy[0].tolist()
            
            bbox_str = f"[x1: {xyxy[0]:.1f}, y1: {xyxy[1]:.1f}, x2: {xyxy[2]:.1f}, y2: {xyxy[3]:.1f}]"
            print(f"  [{i+1}] {Fore.YELLOW}{cls_name}{Style.RESET_ALL} (Conf: {conf:.2f}) | Box: {bbox_str}")

    print(Fore.CYAN + Style.BRIGHT + f"\n[*] Inference completed. Visual results saved to {config.PREDICTIONS_DIR / 'predict'}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Animal Detection Inference Script")
    parser.add_argument(
        "--source", 
        type=str, 
        default="0", 
        help="Input source: path to image, folder, video, or '0' for webcam."
    )
    args = parser.parse_args()
    
    # If the user provides a direct positional argument or uses the flag
    # For robust command line usage, we'll allow both if modified.
    if len(sys.argv) > 1 and not sys.argv[1].startswith("--"):
        source = sys.argv[1]
    else:
        source = args.source
        
    try:
        run_inference(source)
    except Exception as e:
        print(Fore.RED + f"\n[!] Inference Error: {e}")
        sys.exit(1)
