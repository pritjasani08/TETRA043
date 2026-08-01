import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../core/middleware/validateRequest';
import { requireAuth } from '../../core/middleware/requireAuth';
import { signupSchema, loginSchema } from './auth.validator';

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  router.post('/signup', validateRequest(signupSchema), authController.signup);
  router.post('/login', validateRequest(loginSchema), authController.login);
  router.post('/logout', requireAuth, authController.logout);
  router.get('/me', requireAuth, authController.getMe);

  return router;
};
