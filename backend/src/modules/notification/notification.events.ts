import { DomainEvents, EventTypes } from '../../core/events';
import { NotificationService } from './notification.service';
import { NotificationDispatcher } from '../../core/notification/NotificationDispatcher';
import { NotificationType, NotificationPriority, NotificationCategory } from '../../core/enums';
import { logger } from '../../core/utils/logger';

export function initializeNotificationEvents(
  notificationService: NotificationService, 
  dispatcher: NotificationDispatcher
) {
  // 1. Listen for standard domain events and CREATE notifications
  
  DomainEvents.on(EventTypes.USER_REGISTERED, async (payload: { userId: string }) => {
    try {
      await notificationService.createNotification({
        userId: payload.userId,
        category: NotificationCategory.SYSTEM,
        type: NotificationType.SYSTEM,
        title: 'Welcome to AgriShield!',
        message: 'Your account has been successfully created.',
        priority: NotificationPriority.LOW
      });
    } catch (err) {
      logger.error('Failed to create USER_REGISTERED notification', err);
    }
  });

  DomainEvents.on(EventTypes.DETECTION_CREATED, async (payload: { userId: string, detectionId: string, animalType: string, riskLevel: string }) => {
    try {
      let priority = NotificationPriority.MEDIUM;
      if (payload.riskLevel === 'HIGH' || payload.riskLevel === 'CRITICAL') {
        priority = NotificationPriority.HIGH;
      }
      
      await notificationService.createNotification({
        userId: payload.userId,
        category: NotificationCategory.DETECTION,
        type: NotificationType.DETECTION,
        title: 'New Detection Alert',
        message: `A ${payload.animalType} was detected with ${payload.riskLevel} risk level.`,
        priority,
        relatedDetectionId: payload.detectionId,
        metadata: {
          version: 1,
          payload: {
            detectionId: payload.detectionId,
            animalType: payload.animalType,
            riskLevel: payload.riskLevel,
            confidence: 0 // Ideally this comes in payload
          }
        }
      });
    } catch (err) {
      logger.error('Failed to create DETECTION_CREATED notification', err);
    }
  });

  // 2. Listen for NOTIFICATION_CREATED and DISPATCH it to channels (Browser, Push, Voice)
  
  DomainEvents.on(EventTypes.NOTIFICATION_CREATED, async (payload: { notification: any }) => {
    try {
      await dispatcher.publish(payload.notification);
    } catch (err) {
      logger.error('Failed to dispatch notification', err);
    }
  });

  DomainEvents.on(EventTypes.NOTIFICATION_SENT, async (payload: { notificationId: string }) => {
    logger.info(`[NotificationService] Notification ${payload.notificationId} successfully sent`);
    // Future: Update DB status to SENT
  });

  DomainEvents.on(EventTypes.NOTIFICATION_FAILED, async (payload: { notificationId: string, deviceToken: string }) => {
    logger.warn(`[NotificationService] Notification ${payload.notificationId} failed for token ${payload.deviceToken}`);
    // Future: Update DB status to FAILED, mark token invalid if necessary
  });
}
