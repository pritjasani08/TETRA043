import cv2
import threading
import queue

class VideoWriterThread(threading.Thread):
    def __init__(self, output_path, fps, width, height, codec, render_queue, progress_tracker):
        super().__init__()
        self.output_path = output_path
        self.fps = fps
        self.width = width
        self.height = height
        self.codec = codec
        self.render_queue = render_queue
        self.progress_tracker = progress_tracker
        self.all_json_results = []
        self.daemon = True # Dies when main thread dies
        
    def run(self):
        # Initialize VideoWriter
        fourcc = cv2.VideoWriter_fourcc(*self.codec)
        writer = cv2.VideoWriter(self.output_path, fourcc, self.fps, (self.width, self.height))
        
        # We need to write frames in exact order. 
        # The render_queue yields tuples of (frame_index, frame_image, json_data)
        # Since CPU rendering might finish out of order, we use a buffer to reorder them.
        next_frame_to_write = 0
        buffer = {}
        
        while True:
            try:
                item = self.render_queue.get()
                if item is None:
                    # End of stream
                    break
                    
                frame_idx, frame, json_results = item
                buffer[frame_idx] = (frame, json_results)
                
                # Write as many consecutive frames as possible
                while next_frame_to_write in buffer:
                    f, j_data = buffer.pop(next_frame_to_write)
                    writer.write(f)
                    if j_data:
                        self.all_json_results.extend(j_data)
                        
                    next_frame_to_write += 1
                    self.progress_tracker.update_encoded(1)
                    
            except Exception as e:
                print(f"\n[Video Writer] Error: {e}")
                break
                
        writer.release()
        
        # Write JSON output
        try:
            import json
            import os
            predictions_dir = os.path.join(os.path.dirname(__file__), "predictions")
            os.makedirs(predictions_dir, exist_ok=True)
            json_path = os.path.join(predictions_dir, "results.json")
            with open(json_path, 'w') as f:
                json.dump(self.all_json_results, f, indent=4)
        except Exception as e:
            print(f"\n[Video Writer] Failed to write JSON results: {e}")
