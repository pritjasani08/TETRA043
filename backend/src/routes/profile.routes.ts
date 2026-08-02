import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getProfile);
router.put('/', authenticate, updateProfile);

export default router;
