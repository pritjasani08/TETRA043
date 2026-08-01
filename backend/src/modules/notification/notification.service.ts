import { INotificationRepository } from './notification.repository';
import { DomainEvents, EventTypes } from '../../core/events';
import { 
  CreateNotificationDto, 
  NotificationDto, 
  RegisterDeviceTokenDto, 
  DeviceTokenDto 
} from './notification.types';
import { NotificationMapper } from './notification.mapper';
import { NotificationType } from '../../core/enums';

export class NotificationService {
  constructor(private readonly repository: INotificationRepository) {}

  async createNotification(data: CreateNotificationDto): Promise<NotificationDto> {
    const entity = await this.repository.createNotification(data);
    const dto = NotificationMapper.toDto(entity);
    
    // Emitting event to trigger dispatch logic (Push/Voice/etc)
    DomainEvents.emitEvent(EventTypes.NOTIFICATION_CREATED, { notification: dto });
    
    return dto;
  }

  async getNotifications(
    userId: string, 
    limit: number, 
    offset: number, 
    isRead?: boolean, 
    type?: NotificationType
  ): Promise<{ data: NotificationDto[], total: number }> {
    const result = await this.repository.getNotifications(userId, limit, offset, isRead, type);
    return {
      data: result.data.map(NotificationMapper.toDto),
      total: result.total
    };
  }

  async getUnreadNotifications(userId: string): Promise<NotificationDto[]> {
    const entities = await this.repository.getUnreadNotifications(userId);
    return entities.map(NotificationMapper.toDto);
  }

  async markAsRead(userId: string, notificationId: string): Promise<NotificationDto | null> {
    const entity = await this.repository.markAsRead(userId, notificationId);
    if (!entity) return null;
    
    DomainEvents.emitEvent(EventTypes.NOTIFICATION_READ, { userId, notificationId });
    return NotificationMapper.toDto(entity);
  }

  async markAllAsRead(userId: string): Promise<number> {
    return await this.repository.markAllAsRead(userId);
  }

  async deleteNotification(userId: string, notificationId: string): Promise<boolean> {
    const deleted = await this.repository.deleteNotification(userId, notificationId);
    if (deleted) {
      DomainEvents.emitEvent(EventTypes.NOTIFICATION_DELETED, { userId, notificationId });
    }
    return deleted;
  }

  async registerDeviceToken(userId: string, data: RegisterDeviceTokenDto): Promise<DeviceTokenDto> {
    const entity = await this.repository.registerDeviceToken(userId, data);
    return NotificationMapper.tokenToDto(entity);
  }

  async removeDeviceToken(userId: string, tokenId: string): Promise<boolean> {
    return await this.repository.removeDeviceToken(userId, tokenId);
  }
}
