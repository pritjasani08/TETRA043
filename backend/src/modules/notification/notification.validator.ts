import { z } from 'zod';
import { NotificationType } from '../../core/enums';

export const registerDeviceTokenSchema = z.object({
  body: z.object({
    deviceToken: z.string().min(1, 'Device token is required'),
    platform: z.string().optional(),
    deviceName: z.string().optional(),
    appVersion: z.string().optional(),
  }).strict()
});

export const getNotificationsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    isRead: z.enum(['true', 'false']).optional(),
    type: z.nativeEnum(NotificationType).optional()
  }).strict()
});
