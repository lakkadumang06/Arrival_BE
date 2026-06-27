import { Router } from 'express';
import { FormController } from './form.controller';
import {
  createFieldValidator,
  updateFieldValidator,
  reorderFieldsValidator,
  fieldIdValidator,
} from './form.validator';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Public route
router.get('/active', FormController.getActiveForm);

// Protected routes
router.get('/', authenticate, FormController.getAll);
router.post('/', authenticate, createFieldValidator, validate, FormController.create);
router.put('/reorder', authenticate, reorderFieldsValidator, validate, FormController.reorder);
router.get('/:id', authenticate, fieldIdValidator, validate, FormController.getById);
router.put('/:id', authenticate, updateFieldValidator, validate, FormController.update);
router.delete('/:id', authenticate, fieldIdValidator, validate, FormController.delete);

export default router;
