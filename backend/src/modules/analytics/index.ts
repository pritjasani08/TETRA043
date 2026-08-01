import { MockAnalyticsRepository } from './analytics.repository';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { createAnalyticsRoutes } from './analytics.routes';

// Module Dependency Injection
const analyticsRepository = new MockAnalyticsRepository();
const analyticsService = new AnalyticsService(analyticsRepository);
const analyticsController = new AnalyticsController(analyticsService);
const analyticsRoutes = createAnalyticsRoutes(analyticsController);

export { analyticsRoutes };
