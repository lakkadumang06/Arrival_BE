import { body, param } from 'express-validator';
import { InquiryStatus } from '../../shared/types';

const STATUSES = Object.values(InquiryStatus);

export const createInquiryValidator = [
  body('formData').isObject().withMessage('Form data must be an object'),
  body('formData.name').notEmpty().withMessage('Name is required'),
  body('formData.mobile').notEmpty().withMessage('Mobile number is required'),
];

export const updateInquiryValidator = [
  param('id').isMongoId().withMessage('Invalid inquiry ID'),
  body('status').optional().isIn(STATUSES).withMessage('Invalid status'),
  body('notes').optional().isString(),
  body('name').optional().isString(),
  body('mobile').optional().isString(),
];

export const updateStatusValidator = [
  param('id').isMongoId().withMessage('Invalid inquiry ID'),
  body('status').isIn(STATUSES).withMessage('Invalid status'),
];

export const inquiryIdValidator = [
  param('id').isMongoId().withMessage('Invalid inquiry ID'),
];
