import { Router } from 'express';
import authRoutes from './auth.routes';
import detectionRoutes from './detection.routes';
import dashboardRoutes from './dashboard.routes';
import profileRoutes from './profile.routes';
import communityRoutes from './community.routes';
import notificationRoutes from './notification.routes';
import farmRoutes from './farm.routes';
import analyticsRoutes from './analytics.routes';
import alertRoutes from './alert.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/detection', detectionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/profile', profileRoutes);
router.use('/community', communityRoutes);
router.use('/notifications', notificationRoutes);
router.use('/farms', farmRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/alerts', alertRoutes);

export default router;
