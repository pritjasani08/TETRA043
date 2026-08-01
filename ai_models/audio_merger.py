import subprocess
import os

def merge_audio(original_video_path, processed_video_no_audio, final_output_path):
    """
    Extracts audio from the original video and muxes it into the newly processed video.
    Uses FFmpeg for fast stream copying without re-encoding the video again.
    """
    print(f"\n[Audio Merger] Merging original audio into {final_output_path}...")
    
    # Ensure final output doesn't exist yet
    if os.path.exists(final_output_path):
        os.remove(final_output_path)
        
    try:
        # Command: 
        # -i processed_video_no_audio (video stream)
        # -i original_video_path (audio stream)
        # -c:v copy (copy video stream without re-encoding)
        # -c:a aac (encode audio to AAC to ensure compatibility, or just copy)
        # -map 0:v:0 -map 1:a:0 (take video from first input, audio from second)
        
        command = [
            "ffmpeg",
            "-y", # Overwrite output
            "-i", processed_video_no_audio,
            "-i", original_video_path,
            "-c:v", "libx264",
            "-preset", "fast",
            "-pix_fmt", "yuv420p", # Ensure standard pixel format for web
            "-c:a", "aac",
            "-map", "0:v:0",
            "-map", "1:a:0?", # The '?' means if audio doesn't exist, ignore instead of failing
            "-shortest", # Finish encoding when the shortest input stream ends
            final_output_path
        ]
        
        # Run ffmpeg, suppress normal output but capture errors
        result = subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
        
        if result.returncode != 0:
            print(f"[Audio Merger] Warning: FFmpeg failed to merge audio. Falling back to video without audio.")
            print(f"[FFmpeg Error]: {result.stderr}")
            # If it fails, just rename the no_audio video to the final name
            import shutil
            shutil.copy2(processed_video_no_audio, final_output_path)
            return False
            
        print("[Audio Merger] Audio merged successfully!")
        return True
        
    except FileNotFoundError:
        print("[Audio Merger] FFmpeg not found on system! Please install FFmpeg.")
        print("[Audio Merger] Falling back to silent video.")
        import shutil
        shutil.copy2(processed_video_no_audio, final_output_path)
        return False
    except Exception as e:
        print(f"[Audio Merger] Error: {e}")
        import shutil
        shutil.copy2(processed_video_no_audio, final_output_path)
        return False
