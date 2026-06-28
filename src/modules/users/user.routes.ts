import { Router } from 'express';
import { body, param } from 'express-validator';
import { UserController } from './user.controller';
import { validate } from '../../middleware/validate';
import { authenticate, requirePermission } from '../../middleware/auth';
import { UserRole } from '../../shared/types';

const router = Router();

// User & permission management is an Owner capability (manageUsers).
router.use(authenticate, requirePermission('manageUsers'));

router.get('/', UserController.getAll);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(Object.values(UserRole)),
  ],
  validate,
  UserController.create
);

router.patch(
  '/:id/permissions',
  [param('id').isMongoId(), body('permissions').isObject()],
  validate,
  UserController.updatePermissions
);

router.put('/:id', [param('id').isMongoId()], validate, UserController.update);
router.delete('/:id', [param('id').isMongoId()], validate, UserController.delete);

export default router;
