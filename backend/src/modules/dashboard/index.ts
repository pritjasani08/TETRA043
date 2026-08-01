import { MockDashboardRepository } from './dashboard.repository';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { createDashboardRoutes } from './dashboard.routes';

const dashboardRepository = new MockDashboardRepository();
const dashboardService = new DashboardService(dashboardRepository);
const dashboardController = new DashboardController(dashboardService);
const dashboardRoutes = createDashboardRoutes(dashboardController);

export { dashboardRoutes };
