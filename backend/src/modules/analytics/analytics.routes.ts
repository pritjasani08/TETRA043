import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { requireAuth } from '../../core/middleware/requireAuth';
import { validateRequest } from '../../core/middleware/validateRequest';
import { analyticsSummarySchema } from './analytics.validator';

export const createAnalyticsRoutes = (analyticsController: AnalyticsController): Router => {
  const router = Router();

  router.get(
    '/summary',
    requireAuth,
    validateRequest(analyticsSummarySchema),
    analyticsController.getSummary
  );

  return router;
};
