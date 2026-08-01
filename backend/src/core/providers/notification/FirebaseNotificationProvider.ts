import { INotificationProvider } from "./INotificationProvider";
import {
  NotificationDto,
  RawDeviceTokenEntity,
} from "../../../modules/notification/notification.types";
import { RawSettingsEntity } from "../../../modules/settings/settings.types";
import { logger } from "../../utils/logger";
import { DomainEvents, EventTypes } from "../../events";

// TODO: Import firebase-admin here when required in the future.
// import * as admin from 'firebase-admin';

export class FirebaseNotificationProvider implements INotificationProvider {
  constructor() {
    // TODO: Initialize firebase-admin instance here
    // admin.initializeApp({ credential: admin.credential.cert(...) });
    logger.info("[FirebaseNotificationProvider] Initialized (Skeleton Mode)");
  }

  async dispatch(
    notification: NotificationDto,
    settings: RawSettingsEntity,
    tokens: RawDeviceTokenEntity[],
  ): Promise<void> {
    if (!settings.notification_enabled) return;

    if (!tokens || tokens.length === 0) return;

    for (const device of tokens) {
      if (!device.is_active) continue;

      try {
        logger.info(
          `[FirebaseNotificationProvider] Preparing to send push to token ${device.device_token}`,
        );
        // const message = {
        //   notification: { title: notification.title, body: notification.message },
        //   data: {
        //     id: notification.id,
        //     type: notification.type,
        //     relatedDetectionId: notification.relatedDetectionId || ''
        //   },
        //   token: device.device_token
        // };
        // await admin.messaging().send(message);

        DomainEvents.emitEvent(EventTypes.NOTIFICATION_SENT, {
          notificationId: notification.id,
        });
      } catch (error) {
        logger.error(
          `[FirebaseNotificationProvider] Failed to push to token ${device.device_token}`,
          error,
        );
        DomainEvents.emitEvent(EventTypes.NOTIFICATION_FAILED, {
          notificationId: notification.id,
          deviceToken: device.device_token,
        });
      }
    }
  }
}
