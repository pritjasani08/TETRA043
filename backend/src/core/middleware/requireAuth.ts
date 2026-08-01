import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/JwtService';
import { HTTP_STATUS } from '../constants/http';
import { ApiResponse } from '../utils/ApiResponse';
import { JWT_CONSTANTS } from '../constants/jwt';

const jwtService = new JwtService();

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(ApiResponse.failure('Authorization header missing'));
  }

  if (!authHeader.startsWith(JWT_CONSTANTS.TOKEN_PREFIX)) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(ApiResponse.failure('Invalid Authorization scheme. Expected Bearer'));
  }

  const token = jwtService.extractTokenFromHeader(authHeader);
  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(ApiResponse.failure('Authentication token missing'));
  }

  try {
    const payload = jwtService.verify(token);
    req.auth = payload;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(ApiResponse.failure('Authentication token expired'));
    }
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(ApiResponse.failure('Invalid authentication token'));
  }
};
