import { RawDashboardEntity } from './dashboard.types';

export interface IDashboardRepository {
  getDashboardData(): Promise<RawDashboardEntity>;
}
