import { Router } from 'express';
import { getPosts, createPost, addComment, likePost, getStats } from '../controllers/community.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/stats', authenticate, getStats);
router.get('/posts', authenticate, getPosts);
router.post('/posts', authenticate, createPost);
router.post('/posts/:id/comments', authenticate, addComment);
router.post('/posts/:id/like', authenticate, likePost);

export default router;
