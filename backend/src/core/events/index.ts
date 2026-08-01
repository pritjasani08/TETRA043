import { EventEmitter } from 'events';
import { logger } from '../utils/logger';

class DomainEventEmitter extends EventEmitter {
  constructor() {
    super();
    // Log all emitted events for debugging
    this.on('newListener', (event) => {
      logger.debug(`New listener attached for event: ${event.toString()}`);
    });
  }

  emitEvent(eventName: string, payload: any) {
    logger.info(`[Event Emitted] ${eventName}`, payload);
    this.emit(eventName, payload);
  }
}

export const DomainEvents = new DomainEventEmitter();

export const EventTypes = {
  USER_REGISTERED: 'USER_REGISTERED',
  USER_LOGGED_IN: 'USER_LOGGED_IN',
  USER_LOGGED_OUT: 'USER_LOGGED_OUT',
  DETECTION_CREATED: 'DETECTION_CREATED',
  ALERT_TRIGGERED: 'ALERT_TRIGGERED',
  COMMUNITY_BROADCASTED: 'COMMUNITY_BROADCASTED',
  DETERRENT_ACTIVATED: 'DETERRENT_ACTIVATED',
};
