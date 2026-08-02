import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../services/dashboard.service';
import { queryKeys } from '../lib/queryKeys';
import { DashboardSummaryDto } from '../../../backend/src/modules/dashboard/dashboard.types';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary,
    queryFn: async () => {
      const data = await DashboardService.getSummary() as DashboardSummaryDto;

      // Map backend DTOs to Recharts compatible arrays
      const dailyTrend = data.charts?.dailyTrend?.labels?.map((label: string, i: number) => ({
        day: label,
        intrusions: data.charts.dailyTrend.series[i] || 0,
      })) || [];

      const weeklyActivity = data.charts?.weeklyTrend?.labels?.map((label: string, i: number) => ({
        week: label,
        intrusions: data.charts.weeklyTrend.series[i] || 0,
        deterred: Math.floor((data.charts.weeklyTrend.series[i] || 0) * 0.8), // Mocking deterred for chart
      })) || [];

      const monthlyActivity = data.charts?.monthlyTrend?.labels?.map((label: string, i: number) => ({
        month: label,
        intrusions: data.charts.monthlyTrend.series[i] || 0,
      })) || [];

      const distribution = data.charts?.animalDistribution?.map((d: any) => ({
        name: d.species,
        value: d.value,
      })) || [];

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
