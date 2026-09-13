import { Router } from 'express';
import { getProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticateToken, getProfile);

export default router;
