import { Router } from 'express';
import { FAQController } from './faq.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Public
router.get('/public', FAQController.getEnabled);

// Protected
router.get('/', authenticate, FAQController.getAll);
router.post('/', authenticate, FAQController.create);
router.get('/:id', authenticate, FAQController.getById);
router.put('/:id', authenticate, FAQController.update);
router.delete('/:id', authenticate, FAQController.delete);

export default router;
