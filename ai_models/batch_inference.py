import time
import torch
from queue import Empty

class BatchInference:
    def __init__(self, model, frame_queue, inference_queue, progress_tracker, fps, initial_batch_size=8):
        self.model = model
        self.frame_queue = frame_queue
        self.inference_queue = inference_queue
        self.progress_tracker = progress_tracker
        self.batch_size = initial_batch_size
        self.fps = fps
        self.total_processing_time = 0.0
        self.max_gpu_memory = 0.0
        self.detected_animals_count = {}
        
    def _process_batch(self, batch_frames, batch_indices):
        # We use model.track with persist=True for tracking
        # ultralytics supports batch inputs directly as a list of numpy arrays
        # Ensure we pass half=True for FP16 optimization
        start_time = time.time()
        
        # OOM handling loop
        while self.batch_size > 0:
            try:
                # If batch size was reduced, we might need to process the current chunk in smaller sub-batches
                # But to keep it simple, we process exactly what was passed. If it OOMs, we split it.
                if len(batch_frames) > self.batch_size:
                    # Split into chunks of self.batch_size
                    all_results = []
                    for i in range(0, len(batch_frames), self.batch_size):
                        sub_frames = batch_frames[i:i+self.batch_size]
                        results = self.model.track(
                            source=sub_frames,
                            persist=True,
                            tracker="bytetrack.yaml",
                            verbose=False
                        )
                        all_results.extend(results)
                else:
                    all_results = self.model.track(
                        source=batch_frames,
                        persist=True,
                        tracker="bytetrack.yaml",
                        verbose=False
                    )
                
                # Success!
                if torch.cuda.is_available():
                    mem_allocated = torch.cuda.max_memory_allocated() / (1024 ** 2)
                    self.max_gpu_memory = max(self.max_gpu_memory, mem_allocated)
                    
                self.total_processing_time += (time.time() - start_time)
                
                # Push results to CPU render queue
                for i, res in enumerate(all_results):
                    frame_idx = batch_indices[i]
                    frame = batch_frames[i]
                    
                    # Convert raw detections into dictionaries for CPU workers
                    boxes_data = []
                    if res.boxes is not None and len(res.boxes) > 0:
                        boxes = res.boxes.xyxy.cpu().numpy()
                        confs = res.boxes.conf.cpu().numpy()
                        clss = res.boxes.cls.cpu().numpy()
                        # Handle case where IDs might not be present if tracker lost them
                        if res.boxes.id is not None:
                            ids = res.boxes.id.cpu().numpy()
                        else:
                            ids = [None] * len(boxes)
                            
                        for b, conf, cls, trk_id in zip(boxes, confs, clss, ids):
                            name = res.names[int(cls)]
                            boxes_data.append({
                                'box': b,
                                'conf': float(conf),
                                'class_id': int(cls),
                                'name': name,
                                'id': int(trk_id) if trk_id is not None else None
                            })
                            
                            # Tally detections
                            if name not in self.detected_animals_count:
                                self.detected_animals_count[name] = 0
                            self.detected_animals_count[name] += 1
                    
                    # Calculate timestamp
                    timestamp_sec = frame_idx / self.fps
                    timestamp_str = time.strftime('%H:%M:%S', time.gmtime(timestamp_sec))
                    
                    self.inference_queue.put((frame_idx, frame, boxes_data, timestamp_str))
                    self.progress_tracker.update_inference(1)
                
                return # Successfully processed batch
                
            except RuntimeError as e:
                if "out of memory" in str(e).lower():
                    # Clear cache
                    if torch.cuda.is_available():
                        torch.cuda.empty_cache()
                        
                    if self.batch_size > 1:
                        self.batch_size = max(1, self.batch_size // 2)
                        print(f"\n[GPU OOM] Out of Memory! Reducing batch size to {self.batch_size} and retrying...")
                    else:
                        print(f"\n[GPU FATAL] Out of Memory even with batch size 1! Aborting.")
                        raise e
                else:
                    raise e
        
    def run(self):
        batch_frames = []
        batch_indices = []
        
        while True:
            try:
                # Get frames up to current batch size
                # Use a small timeout so we can flush if queue is empty
                item = self.frame_queue.get(timeout=0.1)
                
                if item is None:
                    # End of stream, flush remaining batch
                    if len(batch_frames) > 0:
                        self._process_batch(batch_frames, batch_indices)
                    
                    # Signal CPU renderers
                    self.inference_queue.put(None)
                    break
                    
                frame_idx, frame = item
                batch_frames.append(frame)
                batch_indices.append(frame_idx)
                
                if len(batch_frames) >= self.batch_size:
                    self._process_batch(batch_frames, batch_indices)
                    batch_frames = []
                    batch_indices = []
                    
            except Empty:
                # Queue empty, if we have frames, process them
                if len(batch_frames) > 0:
                    self._process_batch(batch_frames, batch_indices)
                    batch_frames = []
                    batch_indices = []
            except Exception as e:
                print(f"\n[GPU Inference] Error: {e}")
                break
