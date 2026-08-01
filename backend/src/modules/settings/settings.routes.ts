import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { requireAuth } from '../../core/middleware/requireAuth';
import { validateRequest } from '../../core/middleware/validateRequest';
import { updateSettingsSchema } from './settings.validator';
import { SettingsService } from './settings.service';
import { SqlSettingsRepository } from './settings.repository.sql';
import { MockSettingsRepository } from './settings.repository.mock';
import { env } from '../../config/env';

const router = Router();

// Dependency Injection
const useMock = env.DATABASE_PROVIDER === 'mock';
const repository = useMock ? new MockSettingsRepository() : new SqlSettingsRepository();
const service = new SettingsService(repository);
const controller = new SettingsController(service);

router.use(requireAuth);

router.get('/', controller.getSettings);
router.put('/', validateRequest(updateSettingsSchema), controller.updateSettings);

export const settingsRoutes = router;
export const settingsService = service; // Export service for DI in other modules like auth
