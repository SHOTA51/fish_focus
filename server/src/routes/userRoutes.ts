import { Router } from 'express';
import { getProfile, syncFish } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/fish', authenticateToken, syncFish);

export default router;
