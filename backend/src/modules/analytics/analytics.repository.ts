import { RawAnalyticsEntity } from './analytics.types';
import { MOCK_ANALYTICS_DATA } from './analytics.mock';

export interface IAnalyticsRepository {
  getAnalyticsSummary(): Promise<RawAnalyticsEntity>;
}

export class MockAnalyticsRepository implements IAnalyticsRepository {
  async getAnalyticsSummary(): Promise<RawAnalyticsEntity> {
    // Simulate database aggregation query delay
    await new Promise((resolve) => setTimeout(resolve, 150));
    return MOCK_ANALYTICS_DATA;
  }
}
