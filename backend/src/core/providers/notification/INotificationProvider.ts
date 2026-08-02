import {
  NotificationDto,
  RawDeviceTokenEntity,
} from "../../../modules/notification/notification.types";
import { RawSettingsEntity } from "../../../modules/settings/settings.types";

export interface INotificationProvider {
  /**
   * Dispatches the notification. The provider decides how to handle settings and tokens.
   */
  dispatch(
    notification: NotificationDto,
    settings: RawSettingsEntity,
    tokens: RawDeviceTokenEntity[],
  ): Promise<void>;
}
