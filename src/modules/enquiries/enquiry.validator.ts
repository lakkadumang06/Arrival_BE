import { body, param } from 'express-validator';
import { VISA_TYPES } from './enquiry.model';

export const createEnquiryValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[+]?[\d\s()-]{7,20}$/)
    .withMessage('A valid phone number is required'),

  body('visaType')
    .trim()
    .notEmpty()
    .withMessage('Interested visa type is required')
    .isIn(VISA_TYPES)
    .withMessage(`Visa type must be one of: ${VISA_TYPES.join(', ')}`),

  body('message')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Message cannot exceed 2000 characters'),
];

export const updateEnquiryValidator = [
  param('id').isMongoId().withMessage('Invalid enquiry ID'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'closed'])
    .withMessage('Invalid status'),
];

export const enquiryIdValidator = [
  param('id').isMongoId().withMessage('Invalid enquiry ID'),
];
