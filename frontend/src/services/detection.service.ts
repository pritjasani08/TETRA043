import { ApiClient } from '../lib/api';

export class DetectionService {
  static async analyze(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return ApiClient.post<any>('/detections/analyze', formData);
  }
}
