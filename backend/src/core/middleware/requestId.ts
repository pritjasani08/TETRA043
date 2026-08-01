import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AuthPayload } from '../interfaces';

declare global {
  namespace Express {
    interface Request {
      id: string;
      auth?: AuthPayload;
    }
  }
}

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
};
