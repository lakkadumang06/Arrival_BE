import { Router } from 'express';
import { ServiceController } from './service.controller';
import { authenticate, requireAccess } from '../../middleware/auth';

const router = Router();

// Public
router.get('/public', ServiceController.getEnabled);

// Protected
router.get('/', authenticate, ServiceController.getAll);
router.post('/', authenticate, requireAccess('services', 'create'), ServiceController.create);
router.get('/:id', authenticate, ServiceController.getById);
router.put('/:id', authenticate, requireAccess('services', 'update'), ServiceController.update);
router.delete('/:id', authenticate, requireAccess('services', 'delete'), ServiceController.delete);

export default router;
