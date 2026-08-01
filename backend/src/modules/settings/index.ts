export * from './settings.types';
export * from './settings.validator';
export * from './settings.mapper';
export * from './settings.repository';
export * from './settings.repository.sql';
export * from './settings.repository.mock';
export * from './settings.service';
export * from './settings.controller';
export * from './settings.routes';

import { DomainEvents, EventTypes } from '../../core/events';
import { settingsService } from './settings.routes';

DomainEvents.on(EventTypes.USER_REGISTERED, async (payload: { userId: string }) => {
  try {
    await settingsService.createDefaultSettings(payload.userId);
  } catch (error) {
    console.error(`Failed to create default settings for user ${payload.userId}:`, error);
  }
});
