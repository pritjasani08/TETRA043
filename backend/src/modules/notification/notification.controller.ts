import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { ApiResponse } from '../../core/utils/ApiResponse';
import { ApiError } from '../../core/utils/ApiError';
import { NotificationType } from '../../core/enums';

export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  getNotifications = async (req: Request, res: Response) => {
    const userId = req.auth!.id;
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const offset = (page - 1) * limit;
    
    let isRead: boolean | undefined = undefined;
    if (req.query.isRead === 'true') isRead = true;
    if (req.query.isRead === 'false') isRead = false;
    
    const type = req.query.type as NotificationType | undefined;
    
    const result = await this.service.getNotifications(userId, limit, offset, isRead, type);
    
    res.status(200).json(new ApiResponse(true, 'Notifications retrieved', result));
  };

  getUnreadNotifications = async (req: Request, res: Response) => {
    const userId = req.auth!.id;
    const notifications = await this.service.getUnreadNotifications(userId);
    res.status(200).json(new ApiResponse(true, 'Unread notifications retrieved', notifications));
  };

  markAsRead = async (req: Request, res: Response) => {
    const userId = req.auth!.id;
    const notificationId = req.params.id as string;
    const notification = await this.service.markAsRead(userId, notificationId);
    
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }
    
    res.status(200).json(new ApiResponse(true, 'Notification marked as read', notification));
  };

  markAllAsRead = async (req: Request, res: Response) => {
    const userId = req.auth!.id;
    const count = await this.service.markAllAsRead(userId);
    res.status(200).json(new ApiResponse(true, `Marked ${count} notifications as read`));
  };

  deleteNotification = async (req: Request, res: Response) => {
    const userId = req.auth!.id;
    const notificationId = req.params.id as string;
    const success = await this.service.deleteNotification(userId, notificationId);
    
    if (!success) {
      throw new ApiError(404, 'Notification not found');
    }
    
    res.status(200).json(new ApiResponse(true, 'Notification deleted successfully'));
  };

  registerDeviceToken = async (req: Request, res: Response) => {
    const userId = req.auth!.id;
    const token = await this.service.registerDeviceToken(userId, req.body);
    res.status(201).json(new ApiResponse(true, 'Device token registered successfully', token));
  };

  removeDeviceToken = async (req: Request, res: Response) => {
    const userId = req.auth!.id;
    const tokenId = req.params.id as string;
    const success = await this.service.removeDeviceToken(userId, tokenId);
    
    if (!success) {
      throw new ApiError(404, 'Device token not found');
    }
    
    res.status(200).json(new ApiResponse(true, 'Device token removed successfully'));
  };
}
