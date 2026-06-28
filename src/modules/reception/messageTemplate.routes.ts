import { Router } from 'express';
import { body, param } from 'express-validator';
import { MessageTemplateController } from './messageTemplate.controller';
import { validate } from '../../middleware/validate';
import { authenticate, requirePermission } from '../../middleware/auth';
import { InquiryStatus } from '../../shared/types';

const router = Router();

// All template management is an Owner capability (manageTemplates).
router.use(authenticate, requirePermission('manageTemplates'));

router.get('/', MessageTemplateController.getAll);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('body').notEmpty().withMessage('Message body is required'),
    body('trigger').optional().isIn(Object.values(InquiryStatus)),
    body('channel').optional().isIn(['whatsapp', 'sms', 'email']),
  ],
  validate,
  MessageTemplateController.create
);

router.get('/:id', [param('id').isMongoId()], validate, MessageTemplateController.getById);
router.put('/:id', [param('id').isMongoId()], validate, MessageTemplateController.update);
router.delete('/:id', [param('id').isMongoId()], validate, MessageTemplateController.delete);

export default router;
