import { RawDashboardEntity } from './dashboard.types';
import { MOCK_DASHBOARD_DATA } from './dashboard.mock';

export interface IDashboardRepository {
  getDashboardData(): Promise<RawDashboardEntity>;
}

export class MockDashboardRepository implements IDashboardRepository {
  async getDashboardData(): Promise<RawDashboardEntity> {
    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_DASHBOARD_DATA;
  }
}
