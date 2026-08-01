import { INotificationRepository } from './notification.repository';
import { 
  RawNotificationEntity, 
  RawDeviceTokenEntity, 
  CreateNotificationDto, 
  RegisterDeviceTokenDto 
} from './notification.types';
import { NotificationType, NotificationDeliveryStatus } from '../../core/enums';
import { randomUUID } from 'crypto';

export class MockNotificationRepository implements INotificationRepository {
  private notifications: RawNotificationEntity[] = [];
  private deviceTokens: RawDeviceTokenEntity[] = [];

  async createNotification(data: CreateNotificationDto): Promise<RawNotificationEntity> {
    const newNotif: RawNotificationEntity = {
      id: randomUUID(),
      user_id: data.userId,
      category: data.category,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority,
      delivery_status: NotificationDeliveryStatus.PENDING,
      related_detection_id: data.relatedDetectionId || null,
      metadata: data.metadata || null,
      is_read: false,
      sent_at: null,
      delivered_at: null,
      created_at: new Date(),
      read_at: null
    };
    this.notifications.push(newNotif);
    return newNotif;
  }

  async getNotifications(
    userId: string, 
    limit: number, 
    offset: number, 
    isRead?: boolean, 
    type?: NotificationType
  ): Promise<{ data: RawNotificationEntity[], total: number }> {
    let filtered = this.notifications.filter(n => n.user_id === userId);
    
    if (isRead !== undefined) {
      filtered = filtered.filter(n => n.is_read === isRead);
    }
    
    if (type !== undefined) {
      filtered = filtered.filter(n => n.type === type);
    }

    filtered.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    
    const total = filtered.length;
    const data = filtered.slice(offset, offset + limit);
    
    return { data, total };
  }

  async getUnreadNotifications(userId: string): Promise<RawNotificationEntity[]> {
    return this.notifications
      .filter(n => n.user_id === userId && !n.is_read)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  async markAsRead(userId: string, notificationId: string): Promise<RawNotificationEntity | null> {
    const notif = this.notifications.find(n => n.id === notificationId && n.user_id === userId);
    if (!notif) return null;
    
    notif.is_read = true;
    notif.read_at = new Date();
    return notif;
  }

  async markAllAsRead(userId: string): Promise<number> {
    let count = 0;
    this.notifications.forEach(n => {
      if (n.user_id === userId && !n.is_read) {
        n.is_read = true;
        n.read_at = new Date();
        count++;
      }
    });
    return count;
  }

  async deleteNotification(userId: string, notificationId: string): Promise<boolean> {
    const initialLength = this.notifications.length;
    this.notifications = this.notifications.filter(n => !(n.id === notificationId && n.user_id === userId));
    return this.notifications.length < initialLength;
  }

  async registerDeviceToken(userId: string, data: RegisterDeviceTokenDto): Promise<RawDeviceTokenEntity> {
    const existingIndex = this.deviceTokens.findIndex(dt => dt.device_token === data.deviceToken);
    
    if (existingIndex >= 0) {
      this.deviceTokens[existingIndex].user_id = userId;
      this.deviceTokens[existingIndex].platform = data.platform || null;
      this.deviceTokens[existingIndex].device_name = data.deviceName || null;
      this.deviceTokens[existingIndex].app_version = data.appVersion || null;
      this.deviceTokens[existingIndex].is_active = true;
      this.deviceTokens[existingIndex].last_used_at = new Date();
      this.deviceTokens[existingIndex].updated_at = new Date();
      return this.deviceTokens[existingIndex];
    }

    const newToken: RawDeviceTokenEntity = {
      id: randomUUID(),
      user_id: userId,
      device_token: data.deviceToken,
      platform: data.platform || null,
      device_name: data.deviceName || null,
      app_version: data.appVersion || null,
      is_active: true,
      last_failure: null,
      failure_count: 0,
      last_used_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    };
    
    this.deviceTokens.push(newToken);
    return newToken;
  }

  async removeDeviceToken(userId: string, tokenId: string): Promise<boolean> {
    const initialLength = this.deviceTokens.length;
    this.deviceTokens = this.deviceTokens.filter(dt => !(dt.id === tokenId && dt.user_id === userId));
    return this.deviceTokens.length < initialLength;
  }

  async getDeviceTokens(userId: string): Promise<RawDeviceTokenEntity[]> {
    return this.deviceTokens
      .filter(dt => dt.user_id === userId)
      .sort((a, b) => b.last_used_at.getTime() - a.last_used_at.getTime());
  }
}
