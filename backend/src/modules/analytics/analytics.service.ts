import { BaseService } from '../../core/services/BaseService';
import { IAnalyticsRepository } from './analytics.repository';
import { AnalyticsSummaryDto } from './analytics.types';
import { AnalyticsMapper } from './analytics.mapper';

export class AnalyticsService extends BaseService {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {
    super();
  }

  async getSummary(): Promise<AnalyticsSummaryDto> {
    const rawData = await this.analyticsRepository.getAnalyticsSummary();
    return AnalyticsMapper.toAnalyticsSummaryDto(rawData);
  }
}
