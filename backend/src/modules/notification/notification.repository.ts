import { 
  RawNotificationEntity, 
  RawDeviceTokenEntity, 
  CreateNotificationDto, 
  RegisterDeviceTokenDto 
} from './notification.types';
import { NotificationType } from '../../core/enums';

export interface INotificationRepository {
  createNotification(data: CreateNotificationDto): Promise<RawNotificationEntity>;
  
  getNotifications(
    userId: string, 
    limit: number, 
    offset: number, 
    isRead?: boolean, 
    type?: NotificationType
  ): Promise<{ data: RawNotificationEntity[], total: number }>;
  
  getUnreadNotifications(userId: string): Promise<RawNotificationEntity[]>;
  
  markAsRead(userId: string, notificationId: string): Promise<RawNotificationEntity | null>;
  
  markAllAsRead(userId: string): Promise<number>;
  
  deleteNotification(userId: string, notificationId: string): Promise<boolean>;
  
  registerDeviceToken(userId: string, data: RegisterDeviceTokenDto): Promise<RawDeviceTokenEntity>;
  
  removeDeviceToken(userId: string, tokenId: string): Promise<boolean>;
  
  getDeviceTokens(userId: string): Promise<RawDeviceTokenEntity[]>;
}
