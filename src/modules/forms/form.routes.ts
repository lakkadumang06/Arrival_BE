import { Router } from 'express';
import { FormController } from './form.controller';
import {
  createFieldValidator,
  updateFieldValidator,
  reorderFieldsValidator,
  fieldIdValidator,
} from './form.validator';
import { validate } from '../../middleware/validate';
import { authenticate, requirePermission } from '../../middleware/auth';

const router = Router();

// Public route — used by both the website form and the /reception QR form
// (?scope=reception). No auth so students can load the form on their phones.
router.get('/active', FormController.getActiveForm);

// Protected — reading the field config requires a login.
router.get('/', authenticate, FormController.getAll);

// Mutating the form builder is an Owner capability (manageFormFields).
router.post('/', authenticate, requirePermission('manageFormFields'), createFieldValidator, validate, FormController.create);
router.put('/reorder', authenticate, requirePermission('manageFormFields'), reorderFieldsValidator, validate, FormController.reorder);
router.get('/:id', authenticate, fieldIdValidator, validate, FormController.getById);
router.put('/:id', authenticate, requirePermission('manageFormFields'), updateFieldValidator, validate, FormController.update);
router.delete('/:id', authenticate, requirePermission('manageFormFields'), fieldIdValidator, validate, FormController.delete);

export default router;
