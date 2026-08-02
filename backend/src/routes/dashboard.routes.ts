import { Router } from 'express';
import { getStats, clearAlert, getSummary } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/stats', authenticate, getStats);
router.get('/summary', authenticate, getSummary);
router.post('/alerts/:id/clear', authenticate, clearAlert);

export default router;
