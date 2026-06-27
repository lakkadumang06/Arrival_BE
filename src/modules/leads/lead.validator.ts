import { body, param } from 'express-validator';

export const createLeadValidator = [
  body('formData').isObject().withMessage('Form data must be an object'),
];

export const updateLeadValidator = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'follow_up', 'approved', 'rejected', 'closed'])
    .withMessage('Invalid status'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
];

export const leadIdValidator = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
];
