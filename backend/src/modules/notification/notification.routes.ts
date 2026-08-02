import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { requireAuth } from '../../core/middleware/requireAuth';
import { validateRequest } from '../../core/middleware/validateRequest';
import { registerDeviceTokenSchema, getNotificationsQuerySchema } from './notification.validator';
import { NotificationService } from './notification.service';
import { SqlNotificationRepository } from './notification.repository.sql';
import { MockNotificationRepository } from './notification.repository.mock';
import { DummyNotificationProvider } from '../../core/providers/notification/DummyNotificationProvider';
import { FirebaseNotificationProvider } from '../../core/providers/notification/FirebaseNotificationProvider';
import { NotificationDispatcher } from '../../core/notification/NotificationDispatcher';
import { SqlSettingsRepository } from '../settings/settings.repository.sql';
import { MockSettingsRepository } from '../settings/settings.repository.mock';
import { initializeNotificationEvents } from './notification.events';

const router = Router();

// DI Setup
const provider = process.env.DATABASE_PROVIDER || 'mock';

const notificationRepo = provider === 'postgres' ? new SqlNotificationRepository() : new MockNotificationRepository();
const settingsRepo = provider === 'postgres' ? new SqlSettingsRepository() : new MockSettingsRepository();

// In a real app, you might swap Dummy with Firebase based on an env var like PUSH_PROVIDER
const pushProvider = new DummyNotificationProvider(); 

const service = new NotificationService(notificationRepo);
const dispatcher = new NotificationDispatcher(settingsRepo, notificationRepo);
dispatcher.registerProvider(pushProvider);

const controller = new NotificationController(service);

// Initialize events mapping
initializeNotificationEvents(service, dispatcher);

router.use(requireAuth);

router.get('/', validateRequest(getNotificationsQuerySchema), controller.getNotifications);
router.get('/unread', controller.getUnreadNotifications);
router.patch('/read-all', controller.markAllAsRead);
router.patch('/:id/read', controller.markAsRead);
router.delete('/:id', controller.deleteNotification);

export const notificationRoutes = router;
export const deviceTokenRoutes = Router();

deviceTokenRoutes.use(requireAuth);
deviceTokenRoutes.post('/', validateRequest(registerDeviceTokenSchema), controller.registerDeviceToken);
deviceTokenRoutes.delete('/:id', controller.removeDeviceToken);
