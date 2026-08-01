import { Router } from 'express';
import multer from 'multer';
import { DetectionController } from './detection.controller';
import { requireAuth } from '../../core/middleware/requireAuth';
import { validateRequest } from '../../core/middleware/validateRequest';
import { analyzeSchema } from './detection.validator';

const upload = multer({ storage: multer.memoryStorage() });

export const createDetectionRoutes = (detectionController: DetectionController): Router => {
  const router = Router();

  router.post(
    '/analyze',
    requireAuth,
    upload.single('image'),
    validateRequest(analyzeSchema),
    detectionController.analyze
  );

  return router;
};
