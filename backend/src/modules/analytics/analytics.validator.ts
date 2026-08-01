import { z } from 'zod';

export const analyticsSummarySchema = z.object({
  query: z.object({}).optional(),
});
