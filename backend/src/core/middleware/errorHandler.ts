import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    return res.status(statusCode).json(ApiResponse.failure(message, err.errors));
  }

  if (process.env.NODE_ENV === 'development') {
    logger.error(`Error: ${err.message}`, err);
  }

  res.status(statusCode).json(ApiResponse.failure(message, err.isOperational ? undefined : err.stack));
};
