import { Request, Response } from 'express';
import { checkConnection } from '../../database';
import { ApiResponse } from '../../core/utils/ApiResponse';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { env } from '../../config/env';
import { API_MESSAGES } from '../../core/constants/messages';

export const getHealthStatus = asyncHandler(async (req: Request, res: Response) => {
  const dbConnected = await checkConnection();
  
  const healthData = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    database: dbConnected ? 'connected' : 'disconnected',
    requestId: req.id,
  };

  if (dbConnected) {
    res.status(200).json(ApiResponse.success(API_MESSAGES.HEALTH_SUCCESS, healthData));
  } else {
    res.status(503).json(ApiResponse.failure(API_MESSAGES.HEALTH_FAILURE, healthData));
  }
});
