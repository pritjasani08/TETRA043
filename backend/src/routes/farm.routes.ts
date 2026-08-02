import { Router } from 'express';
import { getFarms, createFarm } from '../controllers/farm.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getFarms);
router.post('/', authenticate, createFarm);

export default router;
