import { IDashboardRepository } from './dashboard.repository';
import { RawDashboardEntity } from './dashboard.types';

export class MockDashboardRepository implements IDashboardRepository {
  async getDashboardData(): Promise<RawDashboardEntity> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      stats: {
        todayCount: 12,
        totalAnimals: 154,
        activeAlerts: 3,
        systemHealthScore: 98,
        riskLevel: 'Medium'
      },
      systemStatus: {
        status: 'Armed',
        activeCameras: 4,
        totalCameras: 5,
        lastSync: new Date()
      },
      trends: {
        daily: { timeLabels: ["00:00", "04:00", "08:00"], dataPoints: [2, 5, 12] },
        weekly: { timeLabels: ["Mon", "Tue", "Wed"], dataPoints: [10, 15, 12] },
        monthly: { timeLabels: ["Week 1", "Week 2"], dataPoints: [50, 60] }
      },
      distribution: [
        { species: 'BOAR', count: 45 },
        { species: 'DEER', count: 30 }
      ],
      peakHours: '18:00 - 22:00',
      recentAlerts: [
        { id: '1', timestamp: new Date(), message: 'High risk detection', severity: 'Critical' }
      ]
    };
  }
}
