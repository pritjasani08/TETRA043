import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '../services/analytics.service';
import { queryKeys } from '../lib/queryKeys';
import { AnalyticsSummaryDto } from '../../../backend/src/modules/analytics/analytics.types';

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.summary,
    queryFn: async () => {
      // Mock data for hackathon demo since backend DB is not configured
      const data = {
        totalIntrusions: 342,
        deterrenceRate: 94.5,
        avgResponseTime: 2.1,
        falsePositives: 5.2,
        dailyTrend: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], series: [12, 19, 8, 22, 14, 31, 10] },
        weeklyTrend: { labels: ['W1', 'W2', 'W3', 'W4'], series: [145, 132, 158, 141] },
        monthlyTrend: { labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [420, 450, 390, 410] },
        animalDistribution: [
          { label: 'Wild Boar', value: 45 },
          { label: 'Nilgai', value: 30 },
          { label: 'Monkey', value: 15 },
          { label: 'Stray Cattle', value: 10 },
        ],
        confidenceDistribution: [
          { bracket: '90-100%', count: 180 },
          { bracket: '80-89%', count: 85 },
          { bracket: '70-79%', count: 42 },
          { bracket: '<70%', count: 15 },
        ],
        peakDetectionHours: [
          { hourRange: '00:00', intensity: 'High' },
          { hourRange: '04:00', intensity: 'Medium' },
          { hourRange: '08:00', intensity: 'Low' },
          { hourRange: '12:00', intensity: 'Low' },
          { hourRange: '16:00', intensity: 'Medium' },
          { hourRange: '20:00', intensity: 'High' },
        ]
      } as unknown as AnalyticsSummaryDto;

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
