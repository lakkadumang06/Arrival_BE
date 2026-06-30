import { Router } from 'express';
import { body, param } from 'express-validator';
import { RoleAccessController } from './roleAccess.controller';
import { validate } from '../../middleware/validate';
import { authenticate, authorize } from '../../middleware/auth';
import { UserRole, MANAGED_ROLES } from '../../shared/types';

const router = Router();

// Any authenticated user may READ the access matrix (the UI uses it to know
// which buttons to show for the current user). Only the Owner may CHANGE it.
router.get('/', authenticate, RoleAccessController.getAll);

router.put(
  '/:role',
  authenticate,
  authorize(UserRole.OWNER),
  [param('role').isIn(MANAGED_ROLES), body('access').isObject()],
  validate,
  RoleAccessController.update
);

export default router;
