import time
import sys

class PipelineProgress:
    def __init__(self, total_frames):
        self.total_frames = total_frames
        self.read_frames = 0
        self.inference_frames = 0
        self.rendered_frames = 0
        self.encoded_frames = 0
        
        self.start_time = time.time()
        self.last_update_time = time.time()
        
    def update_read(self, count=1):
        self.read_frames += count
        
    def update_inference(self, count=1):
        self.inference_frames += count
        
    def update_rendered(self, count=1):
        self.rendered_frames += count
        
    def update_encoded(self, count=1):
        self.encoded_frames += count
        self._print_progress()
        
    def _print_progress(self):
        current_time = time.time()
        # Update terminal at most 5 times per second to prevent flickering
        if current_time - self.last_update_time < 0.2 and self.encoded_frames < self.total_frames:
            return
            
        self.last_update_time = current_time
        elapsed = current_time - self.start_time
        
        if self.encoded_frames > 0:
            fps = self.encoded_frames / elapsed
            eta = (self.total_frames - self.encoded_frames) / fps
        else:
            fps = 0.0
            eta = 0.0
            
        percent = (self.encoded_frames / self.total_frames) * 100 if self.total_frames > 0 else 0
        
        # Format strings
        fps_str = f"{fps:.1f}"
        eta_str = time.strftime('%M:%S', time.gmtime(eta))
        elapsed_str = time.strftime('%M:%S', time.gmtime(elapsed))
        
        # Build progress bar
        bar_len = 20
        filled = int(bar_len * percent // 100)
        bar = '█' * filled + '-' * (bar_len - filled)
        
        status = (
            f"\r[{bar}] {percent:.1f}% | "
            f"Read: {self.read_frames} | "
            f"Infer: {self.inference_frames} | "
            f"Render: {self.rendered_frames} | "
            f"Encode: {self.encoded_frames}/{self.total_frames} | "
            f"FPS: {fps_str} | ETA: {eta_str} | Elapsed: {elapsed_str}"
        )
        
        sys.stdout.write(status)
        sys.stdout.flush()

    def finish(self):
        self._print_progress()
        print() # New line after completion
