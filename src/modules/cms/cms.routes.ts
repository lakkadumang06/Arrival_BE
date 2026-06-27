import { Router } from 'express';
import { CMSController } from './cms.controller';
import { authenticate } from '../../middleware/auth';
import { upload } from '../../middleware/upload';

const router = Router();

// Public route
router.get('/', CMSController.getContent);

// Protected routes
router.put('/', authenticate, CMSController.updateContent);
router.post('/upload', authenticate, upload.single('image'), CMSController.uploadImage);

export default router;
