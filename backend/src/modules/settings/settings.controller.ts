import { Request, Response } from 'express';
import { SettingsService } from './settings.service';
import { ApiResponse } from '../../core/utils/ApiResponse';

export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  getSettings = async (req: Request, res: Response) => {
    const userId = req.auth!.id;
    const settings = await this.service.getSettings(userId);
    
    res.status(200).json(new ApiResponse(true, 'Settings retrieved successfully', settings));
  };

  updateSettings = async (req: Request, res: Response) => {
    const userId = req.auth!.id;
    const updatedSettings = await this.service.updateSettings(userId, req.body);
    
    res.status(200).json(new ApiResponse(true, 'Settings updated successfully', updatedSettings));
  };
}
