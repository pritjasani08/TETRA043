import { z } from 'zod';

export const dashboardSummarySchema = z.object({
  query: z.object({
    // Optional filters could go here in the future, e.g. timeframe
  }).optional(),
});
