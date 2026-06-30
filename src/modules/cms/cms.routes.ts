import { Router } from 'express';
import { CMSController } from './cms.controller';
import { authenticate, requireAccess } from '../../middleware/auth';
import { upload } from '../../middleware/upload';

const router = Router();

// Public route
router.get('/', CMSController.getContent);

// Protected routes
router.put('/', authenticate, requireAccess('cms', 'update'), CMSController.updateContent);
router.post('/upload', authenticate, requireAccess('cms', 'update'), upload.single('image'), CMSController.uploadImage);

export default router;
