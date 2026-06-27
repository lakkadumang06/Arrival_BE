import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Public
router.get('/', SettingsController.get);

// Protected
router.put('/', authenticate, SettingsController.update);

export default router;
