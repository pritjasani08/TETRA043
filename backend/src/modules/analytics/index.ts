import { SqlAnalyticsRepository } from './analytics.repository.sql';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { createAnalyticsRoutes } from './analytics.routes';
import { MockAnalyticsRepository } from './analytics.repository.mock';
import { env } from '../../config/env';

const useMock = env.DATABASE_PROVIDER === 'mock';
const analyticsRepository = useMock ? new MockAnalyticsRepository() : new SqlAnalyticsRepository();
const analyticsService = new AnalyticsService(analyticsRepository);
const analyticsController = new AnalyticsController(analyticsService);
const analyticsRoutes = createAnalyticsRoutes(analyticsController);

export { analyticsRoutes };
