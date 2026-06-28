import { Router } from 'express';
import { EnquiryController } from './enquiry.controller';
import {
  createEnquiryValidator,
  updateEnquiryValidator,
  enquiryIdValidator,
} from './enquiry.validator';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { formSubmitLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Public — client enquiry form (rate-limited + validated)
router.post('/', formSubmitLimiter, createEnquiryValidator, validate, EnquiryController.create);

// Protected — admin management
router.get('/', authenticate, EnquiryController.getAll);
router.get('/:id', authenticate, enquiryIdValidator, validate, EnquiryController.getById);
router.put('/:id', authenticate, updateEnquiryValidator, validate, EnquiryController.update);
router.delete('/:id', authenticate, enquiryIdValidator, validate, EnquiryController.delete);

export default router;
