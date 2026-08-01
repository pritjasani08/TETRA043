import { INotificationProvider } from "../providers/notification/INotificationProvider";
import { ISettingsRepository } from "../../modules/settings";
import { INotificationRepository, NotificationDto } from "../../modules/notification";
import { logger } from "../utils/logger";

/**
 * NotificationDispatcher orchestrates delivering notifications to various channels
 * based on user preferences.
 */
export class NotificationDispatcher {
  private providers: INotificationProvider[] = [];

  constructor(
    private readonly settingsRepo: ISettingsRepository,
    private readonly notificationRepo: INotificationRepository,
  ) {}

  registerProvider(provider: INotificationProvider) {
    this.providers.push(provider);
  }

  async publish(notification: NotificationDto): Promise<void> {
    try {
      const settings = await this.settingsRepo.getSettings(notification.userId);
      if (!settings) {
        logger.warn(
          `No settings found for user ${notification.userId}, defaulting to disabled notifications`,
        );
        return;
      }

      // Fetch tokens centrally to avoid each provider querying the database
      const tokens = await this.notificationRepo.getDeviceTokens(
        notification.userId,
      );

      // Iterate over providers
      // Each provider interprets the settings and tokens to determine if/how it should dispatch
      for (const provider of this.providers) {
        try {
          await provider.dispatch(notification, settings, tokens);
        } catch (error) {
          logger.error(
            `Provider failed to dispatch notification ${notification.id}`,
            error,
          );
        }
      }
    } catch (error) {
      logger.error(`Failed to publish notification ${notification.id}`, error);
    }
  }
}
