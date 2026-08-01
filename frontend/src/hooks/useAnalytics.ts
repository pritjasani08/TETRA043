import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analytics.service';
import { queryKeys } from '../lib/queryKeys';
import { AnalyticsSummaryDto } from '../../../backend/src/modules/analytics/analytics.types';

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.summary,
    queryFn: async () => {
      const data = await AnalyticsService.getSummary() as AnalyticsSummaryDto;

      const dailyTrend = data.dailyTrend.labels.map((label, i) => ({
        day: label,
        intrusions: data.dailyTrend.series[i] || 0,
      }));

      const weeklyActivity = data.weeklyTrend.labels.map((label, i) => ({
        week: label,
        intrusions: data.weeklyTrend.series[i] || 0,
        deterred: Math.floor((data.weeklyTrend.series[i] || 0) * 0.8),
      }));

      const monthlyActivity = data.monthlyTrend.labels.map((label, i) => ({
        month: label,
        intrusions: data.monthlyTrend.series[i] || 0,
      }));

      const distribution = data.animalDistribution.map(d => ({
        name: d.label,
        value: d.value,
      }));
      
      const confidenceBands = data.confidenceDistribution.map(d => ({
        band: d.bracket,
        count: d.count,
      }));
      
      const peakHours = data.peakDetectionHours.map(d => ({
        hour: d.hourRange.split('-')[0] || d.hourRange,
        count: d.intensity === 'High' ? 20 : 10,
      }));

      return {
        ...data,
        dailyTrend,
        weeklyActivity,
        monthlyActivity,
        distribution,
        confidenceBands,
        peakHours,
      };
    },
  });
}
