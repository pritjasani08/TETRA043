import { ApiClient } from "../lib/api";

import { DashboardSummaryDto } from "../../../backend/src/modules/dashboard/dashboard.types";
import {
  ANIMALS,
  DAILY_TREND,
  WEEKLY_ACTIVITY,
  MONTHLY_ACTIVITY,
  PEAK_HOURS,
} from "../lib/agrishield-data";

export class DashboardService {
  static get useMocks() {
    return import.meta.env.VITE_USE_MOCKS === "true";
  }

  static async getSummary() {
    if (this.useMocks) {
      return new Promise<any>((resolve) => {
        setTimeout(
          () =>
            resolve({
              stats: { totalDetections: 0, systemHealth: 100, activeAlerts: 0 },
              systemStatus: { uptime: 99.9, lastSync: new Date().toISOString() },
              distribution: [
                { name: "Wild Boar", value: 45 },
                { name: "Nilgai", value: 30 },
                { name: "Monkey", value: 15 },
                { name: "Unknown", value: 10 },
              ],
              dailyTrend: DAILY_TREND,
              weeklyActivity: WEEKLY_ACTIVITY,
              monthlyActivity: MONTHLY_ACTIVITY,
              recentAlerts: [
                {
                  id: 1,
                  animal: "Wild Boar",
                  time: "10:23 PM",
                  side: "North Fence",
                  level: "Critical",
                  description: "Large boar detected",
                },
              ],
            }),
          800,
        );
      });
    }

    const data = await ApiClient.get<DashboardSummaryDto>("/dashboard/summary");
    return DashboardService.mapDashboardResponse(data);
  }

  static mapDashboardResponse(data: DashboardSummaryDto) {
    const dailyTrend = data.charts.dailyTrend.labels.map((label, i) => ({
      day: label,
      intrusions: data.charts.dailyTrend.series[i] || 0,
    }));

    const weeklyActivity = data.charts.weeklyTrend.labels.map((label, i) => ({
      week: label,
      intrusions: data.charts.weeklyTrend.series[i] || 0,
      deterred: Math.floor((data.charts.weeklyTrend.series[i] || 0) * 0.8),
    }));

    const monthlyActivity = data.charts.monthlyTrend.labels.map((label, i) => ({
      month: label,
      intrusions: data.charts.monthlyTrend.series[i] || 0,
    }));

    const distribution = data.charts.animalDistribution.map((d) => ({
      name: d.species,
      value: d.value,
    }));

    return {
      ...data,
      dailyTrend,
      weeklyActivity,
      monthlyActivity,
      distribution,
      recentAlerts: data.recentAlerts || [],
    };
  }
}
