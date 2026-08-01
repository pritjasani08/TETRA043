import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../services/dashboard.service';
import { queryKeys } from '../lib/queryKeys';
import { DashboardSummaryDto } from '../../../backend/src/modules/dashboard/dashboard.types';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary,
    queryFn: async () => {
      // Mock data for hackathon demo since backend DB is not configured
      const data = {
        stats: {
          totalIntrusions: 142,
          deterred: 138,
          activeNodes: 12,
          offlineNodes: 0,
        },
        recentAlerts: [
          { id: '1', species: 'Wild Boar', location: 'North Fence', timestamp: new Date().toISOString(), status: 'deterred' },
          { id: '2', species: 'Nilgai', location: 'East Gate', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'deterred' },
        ],
        charts: {
          dailyTrend: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], series: [4, 7, 2, 8, 5, 12, 3] },
          weeklyTrend: { labels: ['W1', 'W2', 'W3', 'W4'], series: [45, 32, 58, 41] },
          monthlyTrend: { labels: ['Jan', 'Feb', 'Mar', 'Apr'], series: [120, 150, 90, 110] },
          animalDistribution: [
            { species: 'Wild Boar', value: 45 },
            { species: 'Nilgai', value: 30 },
            { species: 'Stray Cattle', value: 25 },
          ]
        }
      } as unknown as DashboardSummaryDto;

      // Map backend DTOs to Recharts compatible arrays
      const dailyTrend = data.charts.dailyTrend.labels.map((label, i) => ({
        day: label,
        intrusions: data.charts.dailyTrend.series[i] || 0,
      }));

      const weeklyActivity = data.charts.weeklyTrend.labels.map((label, i) => ({
        week: label,
        intrusions: data.charts.weeklyTrend.series[i] || 0,
        deterred: Math.floor((data.charts.weeklyTrend.series[i] || 0) * 0.8), // Mocking deterred for chart
      }));

      const monthlyActivity = data.charts.monthlyTrend.labels.map((label, i) => ({
        month: label,
        intrusions: data.charts.monthlyTrend.series[i] || 0,
      }));

      const distribution = data.charts.animalDistribution.map(d => ({
        name: d.species,
        value: d.value,
      }));

      return {
        ...data,
        dailyTrend,
        weeklyActivity,
        monthlyActivity,
        distribution,
      };
    },
  });
}
