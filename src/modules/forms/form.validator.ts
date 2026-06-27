import { body, param } from 'express-validator';

export const createFieldValidator = [
  body('label').notEmpty().withMessage('Label is required'),
  body('name').notEmpty().withMessage('Field name is required'),
  body('type')
    .isIn([
      'text', 'email', 'phone', 'number', 'textarea', 'date',
      'dropdown', 'radio', 'checkbox', 'country_selector', 'visa_type_selector',
    ])
    .withMessage('Invalid field type'),
];

export const updateFieldValidator = [
  param('id').isMongoId().withMessage('Invalid field ID'),
];

export const reorderFieldsValidator = [
  body('fields').isArray().withMessage('Fields must be an array'),
  body('fields.*.id').isMongoId().withMessage('Invalid field ID'),
  body('fields.*.order').isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
];

export const fieldIdValidator = [
  param('id').isMongoId().withMessage('Invalid field ID'),
];
