import { RawAnalyticsEntity, AnalyticsSummaryDto, PeakDetectionHourDto } from './analytics.types';
import { SecurityScoreCalculator } from './utils/SecurityScoreCalculator';

export class AnalyticsMapper {
  static toAnalyticsSummaryDto(entity: RawAnalyticsEntity): AnalyticsSummaryDto {
    return {
      totalDetections: entity.totalDetections,
      securityScore: SecurityScoreCalculator.calculate(entity),
      dailyTrend: {
        labels: entity.trends.daily.labels,
        series: entity.trends.daily.data,
      },
      weeklyTrend: {
        labels: entity.trends.weekly.labels,
        series: entity.trends.weekly.data,
      },
      monthlyTrend: {
        labels: entity.trends.monthly.labels,
        series: entity.trends.monthly.data,
      },
      animalDistribution: entity.animalDistribution.map((d) => ({
        label: d.category,
        value: d.count,
      })),
      confidenceDistribution: entity.confidenceDistribution.map((d) => ({
        bracket: d.category,
        count: d.count,
      })),
      peakDetectionHours: entity.peakHours.map((hourRange): PeakDetectionHourDto => {
        // Simple mapping rule for frontend visualization
        return {
          hourRange,
          intensity: 'High',
        };
      }),
    };
  }
}
