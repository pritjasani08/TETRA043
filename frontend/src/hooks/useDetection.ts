import { useMutation } from '@tanstack/react-query';
import { DetectionService } from '../services/detection.service';

export function useDetection() {
  return useMutation({
    mutationFn: (file: File) => DetectionService.analyze(file),
  });
}
