import { RawDashboardEntity, DashboardSummaryDto } from './dashboard.types';
import { MetricCardDto } from '../../core/interfaces';

export class DashboardMapper {
  static toDashboardSummaryDto(entity: RawDashboardEntity): DashboardSummaryDto {
    const metrics: MetricCardDto[] = [
      {
        title: "Today's Intrusions",
        value: entity.stats.todayCount,
        status: entity.stats.todayCount > 10 ? 'danger' : 'success',
      },
      {
        title: 'Active Alerts',
        value: entity.stats.activeAlerts,
        status: entity.stats.activeAlerts > 0 ? 'warning' : 'info',
      },
      {
        title: 'Total Animals Detected',
        value: entity.stats.totalAnimals,
        status: 'info',
      },
      {
        title: 'Security Score',
        value: `${entity.stats.systemHealthScore}%`,
        status: entity.stats.systemHealthScore >= 90 ? 'success' : 'warning',
      },
      {
        title: 'Risk Level',
        value: entity.stats.riskLevel,
        status: entity.stats.riskLevel === 'Low' ? 'success' : 'danger',
      },
    ];

    return {
      systemStatus: {
        state: entity.systemStatus.status,
        cameraStatus: `${entity.systemStatus.activeCameras}/${entity.systemStatus.totalCameras} Online`,
        lastUpdated: entity.systemStatus.lastSync.toISOString(),
      },
      metrics,
      charts: {
        dailyTrend: {
          labels: entity.trends.daily.timeLabels,
          series: entity.trends.daily.dataPoints,
        },
        weeklyTrend: {
          labels: entity.trends.weekly.timeLabels,
          series: entity.trends.weekly.dataPoints,
        },
        monthlyTrend: {
          labels: entity.trends.monthly.timeLabels,
          series: entity.trends.monthly.dataPoints,
        },
        animalDistribution: entity.distribution.map((d) => ({
          species: d.species,
          value: d.count,
        })),
      },
      peakDetectionHours: entity.peakHours,
      recentAlerts: entity.recentAlerts.map((a) => ({
        id: a.id,
        time: a.timestamp.toISOString(),
        description: a.message,
        level: a.severity,
      })),
      quickActions: [
        { id: 'arm', label: 'Arm System', actionEndpoint: '/api/v1/system/arm' },
        { id: 'disarm', label: 'Disarm System', actionEndpoint: '/api/v1/system/disarm' },
        { id: 'test_siren', label: 'Test Deterrents', actionEndpoint: '/api/v1/deterrent/test' },
      ],
    };
  }
}
