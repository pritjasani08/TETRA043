import { Router } from 'express';
import { register, login, me, logout, updateProfile } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, me);
router.put('/profile', authenticate, updateProfile);

export default router;
