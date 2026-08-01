import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../constants/http';

export const validateRequest = (schema: ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      console.error('Validation failed:', JSON.stringify(error, null, 2));
      next(error);
    }
  };
