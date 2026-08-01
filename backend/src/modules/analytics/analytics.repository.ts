import { RawAnalyticsEntity } from './analytics.types';

export interface IAnalyticsRepository {
  getAnalyticsSummary(): Promise<RawAnalyticsEntity>;
}
