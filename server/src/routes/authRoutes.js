import { Router } from 'express';
import { login, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/authValidator.js';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);

export default router;
