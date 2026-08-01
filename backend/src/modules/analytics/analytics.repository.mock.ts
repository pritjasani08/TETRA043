import { IAnalyticsRepository } from './analytics.repository';
import { RawAnalyticsEntity } from './analytics.types';

export class MockAnalyticsRepository implements IAnalyticsRepository {
  async getAnalyticsSummary(): Promise<RawAnalyticsEntity> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      totalDetections: 1000,
      unresolvedAlerts: 15,
      criticalIncidents: 3,
      trends: {
        daily: { labels: ["10:00", "14:00"], data: [50, 60] },
        weekly: { labels: ["Mon", "Tue"], data: [200, 250] },
        monthly: { labels: ["Week 1", "Week 2"], data: [800, 900] }
      },
      animalDistribution: [
        { category: 'BOAR', count: 400 },
        { category: 'ELEPHANT', count: 100 }
      ],
      confidenceDistribution: [
        { category: '90-100%', count: 600 },
        { category: '75-89%', count: 300 }
      ],
      peakHours: [
        '22:00'
      ]
    };
  }
}
