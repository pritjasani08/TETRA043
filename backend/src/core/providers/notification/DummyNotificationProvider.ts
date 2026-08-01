import { INotificationProvider } from "./INotificationProvider";
import {
  NotificationDto,
  RawDeviceTokenEntity,
} from "../../../modules/notification/notification.types";
import { RawSettingsEntity } from "../../../modules/settings/settings.types";
import { logger } from "../../utils/logger";
import { DomainEvents, EventTypes } from "../../events";

export class DummyNotificationProvider implements INotificationProvider {
  async dispatch(
    notification: NotificationDto,
    settings: RawSettingsEntity,
    tokens: RawDeviceTokenEntity[],
  ): Promise<void> {
    // Only dispatch push if enabled
    if (!settings.notification_enabled) return;

    if (!tokens || tokens.length === 0) return;

    for (const device of tokens) {
      if (!device.is_active) continue;

      try {
        logger.info(
          `[DummyPush] Sending push to token ${device.device_token.substring(0, 8)}... | Title: ${notification.title}`,
        );
        DomainEvents.emitEvent(EventTypes.NOTIFICATION_SENT, {
          notificationId: notification.id,
        });
      } catch (error) {
        logger.error(
          `[DummyPush] Failed to push to token ${device.device_token}`,
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
