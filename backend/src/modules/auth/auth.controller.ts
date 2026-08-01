import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../core/utils/ApiResponse';
import { asyncHandler } from '../../core/utils/asyncHandler';
import { HTTP_STATUS } from '../../core/constants/http';
import { DomainEvents, EventTypes } from '../../core/events';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signup = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.signup(req.body);
    res.status(HTTP_STATUS.CREATED).json(ApiResponse.success('User created successfully', result));
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    res.status(HTTP_STATUS.OK).json(ApiResponse.success('Login successful', result));
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    if (req.auth) {
      DomainEvents.emitEvent(EventTypes.USER_LOGGED_OUT, { userId: req.auth.id });
    }
    // For stateless JWT, logout is handled client-side by discarding the token
    res.status(HTTP_STATUS.OK).json(ApiResponse.success('Logged out successfully'));
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    // req.auth is guaranteed by the requireAuth middleware
    const result = await this.authService.getMe(req.auth!.id);
    res.status(HTTP_STATUS.OK).json(ApiResponse.success('User profile retrieved', result));
  });
}
