import os
import random
from ultralytics import YOLO

# ==========================================
# PATHS
# ==========================================
MODEL_PATH = r"E:\TETRA043\ai_models\models\best.pt"
TEST_IMAGES_DIR = r"E:\TETRA043\ai_models\animal_detection_dataset\test\images"

def main():
    print("=======================================")
    print(" Model Loading...")
    print("=======================================")
    
    # Load your custom trained model
    model = YOLO(MODEL_PATH)
    
    # Get a random image from the test folder
    images = [f for f in os.listdir(TEST_IMAGES_DIR) if f.endswith(('.jpg', '.png', '.jpeg'))]
    if not images:
        print("No images found for testing!")
        return
        
    random_image = random.choice(images)
    image_path = os.path.join(TEST_IMAGES_DIR, random_image)
    
    print(f"\nModel load ho gaya! Testing on a random image: {random_image}")
    print("Please wait, an image window will pop up automatically...")
    
    # Run prediction and SHOW it on the screen
    model.predict(
        source=image_path, 
        show=True,               # Ye command directly aapki screen par image open kar degi!
        conf=0.25                # Sirf 25% se zyada confidence wale boxes dikhayega
    )
    
    import cv2
    print("\n[!] Image window open hai! Usko close karne ke liye us par click karke koi bhi KEY (button) dabaiye...")
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    
    print("\n=======================================")
    print(f" Testing Complete! Window closed.")
    print("=======================================")

if __name__ == "__main__":
    main()
