import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { requireAuth } from '../../core/middleware/requireAuth';
import { validateRequest } from '../../core/middleware/validateRequest';
import { dashboardSummarySchema } from './dashboard.validator';

export const createDashboardRoutes = (dashboardController: DashboardController): Router => {
  const router = Router();

  router.get(
    '/summary',
    requireAuth,
    validateRequest(dashboardSummarySchema),
    dashboardController.getSummary
  );

  return router;
};
