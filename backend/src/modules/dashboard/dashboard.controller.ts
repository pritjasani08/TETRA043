import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { ApiResponse } from '../../core/utils/ApiResponse';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { HTTP_STATUS } from '../../core/constants/http';

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  getSummary = asyncHandler(async (req: Request, res: Response) => {
    const summary = await this.dashboardService.getDashboardSummary();
    res.status(HTTP_STATUS.OK).json(ApiResponse.success('Dashboard data retrieved', summary));
  });
}
