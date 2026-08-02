import { Router } from 'express';
import { processImage, getHistory, saveDetection } from '../controllers/detection.controller';
import { authenticate } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/process-image', authenticate, upload.single('file'), processImage);
router.post('/process-video', authenticate, upload.single('file'), processImage); // using same logic for now
router.get('/history', authenticate, getHistory);
router.post('/save', authenticate, saveDetection);

export default router;
