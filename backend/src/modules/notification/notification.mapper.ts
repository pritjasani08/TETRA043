import { RawNotificationEntity, RawDeviceTokenEntity, NotificationDto, DeviceTokenDto } from './notification.types';

export class NotificationMapper {
  static toDto(entity: RawNotificationEntity): NotificationDto {
    return {
      id: entity.id,
      userId: entity.user_id,
      category: entity.category,
      type: entity.type,
      title: entity.title,
      message: entity.message,
      priority: entity.priority,
      deliveryStatus: entity.delivery_status,
      relatedDetectionId: entity.related_detection_id,
      metadata: entity.metadata,
      isRead: entity.is_read,
      sentAt: entity.sent_at ? entity.sent_at.toISOString() : null,
      deliveredAt: entity.delivered_at ? entity.delivered_at.toISOString() : null,
      createdAt: entity.created_at.toISOString(),
      readAt: entity.read_at ? entity.read_at.toISOString() : null,
    };
  }

  static tokenToDto(entity: RawDeviceTokenEntity): DeviceTokenDto {
    return {
      id: entity.id,
      userId: entity.user_id,
      deviceToken: entity.device_token,
      platform: entity.platform,
      deviceName: entity.device_name,
      appVersion: entity.app_version,
      isActive: entity.is_active,
      failureCount: entity.failure_count,
      lastUsedAt: entity.last_used_at.toISOString(),
    };
  }
}
