import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { createDashboardRoutes } from './dashboard.routes';
import { SqlDashboardRepository } from './dashboard.repository.sql';
import { MockDashboardRepository } from './dashboard.repository.mock';
import { env } from '../../config/env';

const useMock = env.DATABASE_PROVIDER === 'mock';
const dashboardRepository = useMock ? new MockDashboardRepository() : new SqlDashboardRepository();
const dashboardService = new DashboardService(dashboardRepository);
const dashboardController = new DashboardController(dashboardService);
const dashboardRoutes = createDashboardRoutes(dashboardController);

export { dashboardRoutes };
