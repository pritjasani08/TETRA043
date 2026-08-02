import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "../services/analytics.service";
import { queryKeys } from "../lib/queryKeys";
import { AnalyticsSummaryDto } from "../../../backend/src/modules/analytics/analytics.types";

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.summary,
    queryFn: () => AnalyticsService.getSummary(),
  });
}
