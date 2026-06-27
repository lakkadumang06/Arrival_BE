import { Router } from 'express';
import { AuthController } from './auth.controller';
import { loginValidator, refreshTokenValidator } from './auth.validator';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, loginValidator, validate, AuthController.login);
router.post('/refresh-token', refreshTokenValidator, validate, AuthController.refreshToken);
router.post('/logout', authenticate, AuthController.logout);
router.get('/profile', authenticate, AuthController.getProfile);

export default router;
