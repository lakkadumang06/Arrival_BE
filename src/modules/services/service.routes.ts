import { Router } from 'express';
import { ServiceController } from './service.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Public
router.get('/public', ServiceController.getEnabled);

// Protected
router.get('/', authenticate, ServiceController.getAll);
router.post('/', authenticate, ServiceController.create);
router.get('/:id', authenticate, ServiceController.getById);
router.put('/:id', authenticate, ServiceController.update);
router.delete('/:id', authenticate, ServiceController.delete);

export default router;
