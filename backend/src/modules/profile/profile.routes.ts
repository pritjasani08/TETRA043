import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { requireAuth } from '../../core/middleware/requireAuth';
import { validateRequest } from '../../core/middleware/validateRequest';
import { updateProfileSchema } from './profile.validator';
import { asyncHandler } from '../../core/utils/asyncHandler';

export function createProfileRoutes(controller: ProfileController): Router {
  const router = Router();

  router.use(requireAuth); // All profile routes require auth

  router.get('/', asyncHandler(controller.getProfile));
  router.put('/', validateRequest(updateProfileSchema), asyncHandler(controller.updateProfile));

  return router;
}
