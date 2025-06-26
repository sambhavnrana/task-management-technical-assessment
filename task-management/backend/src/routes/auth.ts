import { Router } from 'express';
import { requireFields } from '../middleware/validate';
import { authenticateJWT } from '../middleware/auth';
import { register, login, profile } from '../controllers/authController';

const router = Router();

router.post('/register', requireFields(['email', 'password', 'name']), register);
router.post('/login', requireFields(['email', 'password']), login);
router.get('/profile', authenticateJWT, profile);

export default router; 