import { ApiClient } from '../lib/api';

export class DashboardService {
  static async getSummary() {
    return ApiClient.get<any>('/dashboard/summary');
  }
}
