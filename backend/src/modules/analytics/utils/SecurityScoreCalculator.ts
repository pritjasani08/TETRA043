import { SecurityScoreDto, RawAnalyticsEntity } from '../analytics.types';

export class SecurityScoreCalculator {
  static calculate(entity: RawAnalyticsEntity): SecurityScoreDto {
    let baseScore = 100;
    
    // Penalize heavily for critical incidents
    baseScore -= entity.criticalIncidents * 10;
    
    // Penalize for unresolved alerts
    baseScore -= entity.unresolvedAlerts * 2;
    
    // Ensure score doesn't drop below 0
    baseScore = Math.max(0, baseScore);

    let status: 'Critical' | 'Warning' | 'Healthy';
    if (baseScore >= 90) status = 'Healthy';
    else if (baseScore >= 70) status = 'Warning';
    else status = 'Critical';

    // Mock trend logic for now
    const trend = baseScore >= 80 ? 'Up' : 'Down';

    return {
      score: baseScore,
      status,
      trend,
    };
  }
}
