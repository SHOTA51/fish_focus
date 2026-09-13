import { Router } from 'express';
import { completeSession } from '../controllers/focusController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/complete', authenticateToken, completeSession);

export default router;
