import { Router } from 'express';
import { SuccessStoryController } from './successStory.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Public
router.get('/public', SuccessStoryController.getEnabled);

// Protected
router.get('/', authenticate, SuccessStoryController.getAll);
router.post('/', authenticate, SuccessStoryController.create);
router.get('/:id', authenticate, SuccessStoryController.getById);
router.put('/:id', authenticate, SuccessStoryController.update);
router.delete('/:id', authenticate, SuccessStoryController.delete);

export default router;
