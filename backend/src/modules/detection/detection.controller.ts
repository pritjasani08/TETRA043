import { Request, Response } from 'express';
import { DetectionService } from './detection.service';
import { ApiResponse } from '../../core/utils/ApiResponse';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { HTTP_STATUS } from '../../core/constants/http';
import { ApiError } from '../../core/utils/ApiError';

export class DetectionController {
  constructor(private readonly detectionService: DetectionService) {}

  analyze = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No image provided for analysis');
    }

    const results = await this.detectionService.processImage(req.file.buffer);
    
    res.status(HTTP_STATUS.OK).json(ApiResponse.success('Image analyzed successfully', results));
  });
}
