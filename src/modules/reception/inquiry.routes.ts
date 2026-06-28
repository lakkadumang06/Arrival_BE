import { Router } from 'express';
import { InquiryController } from './inquiry.controller';
import {
  createInquiryValidator,
  updateInquiryValidator,
  updateStatusValidator,
  inquiryIdValidator,
} from './inquiry.validator';
import { validate } from '../../middleware/validate';
import { authenticate, requirePermission } from '../../middleware/auth';
import { formSubmitLimiter } from '../../middleware/rateLimiter';

const router = Router();

// ── Public ────────────────────────────────────────────────────────────
// Student submits the QR intake form from their phone.
router.post('/', formSubmitLimiter, createInquiryValidator, validate, InquiryController.create);

// ── Protected ─────────────────────────────────────────────────────────
// Live queue & student list — Reception needs viewQueue.
router.get('/queue', authenticate, requirePermission('viewQueue'), InquiryController.getQueue);
router.get('/', authenticate, requirePermission('viewStudentDetails'), InquiryController.getAll);

// Analytics — Owner-only capability.
router.get('/analytics', authenticate, requirePermission('viewAnalytics'), InquiryController.getAnalytics);

router.get('/:id', authenticate, requirePermission('viewStudentDetails'), inquiryIdValidator, validate, InquiryController.getById);

// Status update — the Reception desk's core action (mark arrived / in-consultation).
router.patch('/:id/status', authenticate, requirePermission('updateStatus'), updateStatusValidator, validate, InquiryController.updateStatus);

// Full edit (notes, fields) — gated behind editStudentDetails (Owner-toggleable).
router.put('/:id', authenticate, requirePermission('editStudentDetails'), updateInquiryValidator, validate, InquiryController.update);

router.delete('/:id', authenticate, requirePermission('editStudentDetails'), inquiryIdValidator, validate, InquiryController.delete);

export default router;
