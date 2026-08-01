import { ApiClient } from '../lib/api';

export class AnalyticsService {
  static async getSummary() {
    return ApiClient.get<any>('/analytics/summary');
  }
}
