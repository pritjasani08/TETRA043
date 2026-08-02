import { Router } from 'express';
import { getSummary } from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/summary', authenticate, getSummary);

export default router;
