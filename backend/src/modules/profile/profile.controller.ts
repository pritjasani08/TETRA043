import { Request, Response } from 'express';
import { ProfileService } from './profile.service';
import { ApiResponse } from '../../core/utils/ApiResponse';

export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  getProfile = async (req: Request, res: Response) => {
    // userId is injected by requireAuth middleware
    const userId = req.auth!.id;
    const profile = await this.service.getProfile(userId);
    
    res.status(200).json(new ApiResponse(true, 'Profile retrieved successfully', profile));
  };

  updateProfile = async (req: Request, res: Response) => {
    const userId = req.auth!.id;
    const updatedProfile = await this.service.updateProfile(userId, req.body);
    
    res.status(200).json(new ApiResponse(true, 'Profile updated successfully', updatedProfile));
  };
}
