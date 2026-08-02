import { Router } from 'express';
import { triggerAlert, pollAlert, clearAlert } from '../controllers/alert.controller';

const router = Router();

router.post('/trigger', triggerAlert);
router.get('/poll', pollAlert);
router.post('/clear', clearAlert);

export default router;
