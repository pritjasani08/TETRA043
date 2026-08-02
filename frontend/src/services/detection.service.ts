import { ApiClient } from '../lib/api';

export class DetectionService {
  static async analyze(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return ApiClient.post<any>('/detection/process-image', formData);
  }

  static async getHistory() {
    return ApiClient.get<any[]>('/detection/history');
  }
}
