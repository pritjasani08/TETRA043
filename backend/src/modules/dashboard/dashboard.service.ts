import { BaseService } from '../../core/services/BaseService';
import { IDashboardRepository } from './dashboard.repository';
import { DashboardMapper } from './dashboard.mapper';
import { DashboardSummaryDto } from './dashboard.types';

export class DashboardService extends BaseService {
  constructor(private readonly dashboardRepository: IDashboardRepository) {
    super();
  }

  async getDashboardSummary(): Promise<DashboardSummaryDto> {
    const rawData = await this.dashboardRepository.getDashboardData();
    return DashboardMapper.toDashboardSummaryDto(rawData);
  }
}
