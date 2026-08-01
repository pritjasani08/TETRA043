import cv2
import concurrent.futures
from queue import Empty

# Class colors for visualization
COLORS = [
    (0, 255, 0),     # Green
    (255, 0, 0),     # Blue
    (0, 0, 255),     # Red
    (255, 255, 0),   # Cyan
    (255, 0, 255),   # Magenta
    (0, 255, 255),   # Yellow
    (128, 0, 128),   # Purple
    (255, 165, 0),   # Orange
    (0, 128, 128),   # Teal
    (128, 128, 0)    # Olive
]

class FrameProcessor:
    def __init__(self, inference_queue, render_queue, progress_tracker, num_workers=4):
        self.inference_queue = inference_queue
        self.render_queue = render_queue
        self.progress_tracker = progress_tracker
        self.num_workers = num_workers
        self.all_json_results = []
        
    def _draw_boxes(self, frame_idx, frame, boxes_data, timestamp_str):
        # boxes_data is a list of dicts: { 'id': trk_id, 'class_id': cls_id, 'name': name, 'conf': conf, 'box': [x1, y1, x2, y2] }
        json_results = []
        
        for det in boxes_data:
            x1, y1, x2, y2 = map(int, det['box'])
            conf = det['conf']
            name = det['name']
            track_id = det.get('id', None)
            cls_id = int(det['class_id'])
            
            # Select color based on class id
            color = COLORS[cls_id % len(COLORS)]
            
            # Draw Rectangle
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            
            # Label
            if track_id is not None:
                label = f"ID: {int(track_id)} {name} {conf*100:.1f}%"
            else:
                label = f"{name} {conf*100:.1f}%"
                
            # Draw label background
            (text_w, text_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
            cv2.rectangle(frame, (x1, y1 - text_h - 6), (x1 + text_w + 4, y1), color, -1)
            
            # Draw text (anti-aliased)
            cv2.putText(frame, label, (x1 + 2, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)
            
            # JSON format
            json_results.append({
                "Animal Name": name,
                "Confidence": round(conf, 4),
                "Frame Number": frame_idx,
                "Timestamp": timestamp_str,
                "Bounding Box": [x1, y1, x2, y2],
                "Track ID": int(track_id) if track_id is not None else None
            })
            
        # Draw frame info (timestamp) on the bottom left
        cv2.putText(frame, f"Time: {timestamp_str} | Frame: {frame_idx}", (20, frame.shape[0] - 20), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 4, cv2.LINE_AA)
        cv2.putText(frame, f"Time: {timestamp_str} | Frame: {frame_idx}", (20, frame.shape[0] - 20), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)
            
        return frame_idx, frame, json_results

    def process_worker(self):
        while True:
            try:
                # 1 second timeout so threads can eventually die if pipeline stalls/ends
                item = self.inference_queue.get(timeout=1.0)
                if item is None:
                    # Signal to other workers
                    self.inference_queue.put(None)
                    break
                    
                frame_idx, frame, boxes_data, timestamp_str = item
                processed_idx, processed_frame, json_results = self._draw_boxes(frame_idx, frame, boxes_data, timestamp_str)
                
                # Add to queue for writing
                self.render_queue.put((processed_idx, processed_frame, json_results))
                self.progress_tracker.update_rendered(1)
                
            except Empty:
                continue
            except Exception as e:
                print(f"\n[Render Worker] Error: {e}")

    def start(self):
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=self.num_workers)
        self.futures = [self.executor.submit(self.process_worker) for _ in range(self.num_workers)]
        
    def wait(self):
        concurrent.futures.wait(self.futures)
        self.render_queue.put(None) # Signal writer thread
        self.executor.shutdown()
