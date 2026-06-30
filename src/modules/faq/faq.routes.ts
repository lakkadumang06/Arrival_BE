import { Router } from 'express';
import { FAQController } from './faq.controller';
import { authenticate, requireAccess } from '../../middleware/auth';

const router = Router();

// Public
router.get('/public', FAQController.getEnabled);

// Protected
router.get('/', authenticate, FAQController.getAll);
router.post('/', authenticate, requireAccess('faq', 'create'), FAQController.create);
router.get('/:id', authenticate, FAQController.getById);
router.put('/:id', authenticate, requireAccess('faq', 'update'), FAQController.update);
router.delete('/:id', authenticate, requireAccess('faq', 'delete'), FAQController.delete);

export default router;
