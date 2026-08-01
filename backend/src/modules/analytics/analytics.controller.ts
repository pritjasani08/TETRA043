import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { ApiResponse } from '../../core/utils/ApiResponse';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { HTTP_STATUS } from '../../core/constants/http';

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  getSummary = asyncHandler(async (req: Request, res: Response) => {
    const summary = await this.analyticsService.getSummary();
    res.status(HTTP_STATUS.OK).json(ApiResponse.success('Analytics retrieved successfully', summary));
  });
}
