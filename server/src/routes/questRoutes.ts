import { Router } from 'express';
import { getQuests } from '../controllers/questController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getQuests);

export default router;
