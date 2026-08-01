import { 
  NotificationType, 
  NotificationPriority, 
  NotificationCategory,
  NotificationDeliveryStatus 
} from '../../core/enums';

// -----------------------------------------
// Entities (Database representations)
// -----------------------------------------
export interface RawNotificationEntity {
  id: string;
  user_id: string;
  category: NotificationCategory;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  delivery_status: NotificationDeliveryStatus;
  related_detection_id: string | null;
  metadata: NotificationMetadata | null;
  is_read: boolean;
  sent_at: Date | null;
  delivered_at: Date | null;
  created_at: Date;
  read_at: Date | null;
}

export interface RawDeviceTokenEntity {
  id: string;
  user_id: string;
  device_token: string;
  platform: string | null;
  device_name: string | null;
  app_version: string | null;
  is_active: boolean;
  last_failure: Date | null;
  failure_count: number;
  last_used_at: Date;
  created_at: Date;
  updated_at: Date;
}

// -----------------------------------------
// Metadata structures for JSONB
// -----------------------------------------
export interface DetectionMetadataPayload {
  detectionId: string;
  animalType: string;
  riskLevel: string;
  confidence: number;
}

export interface CommunityMetadataPayload {
  postId: string;
  commentId?: string;
  userId: string;
}

export interface SystemMetadataPayload {
  version: string;
  module: string;
}

export interface NotificationMetadata {
  version: number;
  payload: DetectionMetadataPayload | CommunityMetadataPayload | SystemMetadataPayload | any;
}

// -----------------------------------------
// DTOs (Frontend representations)
// -----------------------------------------
export interface NotificationDto {
  id: string;
  userId: string;
  category: NotificationCategory;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  deliveryStatus: NotificationDeliveryStatus;
  relatedDetectionId: string | null;
  metadata: NotificationMetadata | null;
  isRead: boolean;
  sentAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  readAt: string | null;
}

export interface DeviceTokenDto {
  id: string;
  userId: string;
  deviceToken: string;
  platform: string | null;
  deviceName: string | null;
  appVersion: string | null;
  isActive: boolean;
  failureCount: number;
  lastUsedAt: string;
}

export interface CreateNotificationDto {
  userId: string;
  category: NotificationCategory;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  relatedDetectionId?: string;
  metadata?: NotificationMetadata;
}

export interface RegisterDeviceTokenDto {
  deviceToken: string;
  platform?: string;
  deviceName?: string;
  appVersion?: string;
}
