import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "../services/dashboard.service";
import { queryKeys } from "../lib/queryKeys";
import { DashboardSummaryDto } from "../../../backend/src/modules/dashboard/dashboard.types";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary,
    queryFn: () => DashboardService.getSummary(),
  });
}
