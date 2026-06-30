import { Router } from 'express';
import { LeadController } from './lead.controller';
import { createLeadValidator, updateLeadValidator, leadIdValidator } from './lead.validator';
import { validate } from '../../middleware/validate';
import { authenticate, requireAccess } from '../../middleware/auth';
import { formSubmitLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Public route - form submission
router.post('/', formSubmitLimiter, createLeadValidator, validate, LeadController.create);

// Protected routes
router.get('/', authenticate, LeadController.getAll);
router.get('/stats', authenticate, LeadController.getStats);
router.get('/recent', authenticate, LeadController.getRecent);
router.get('/export', authenticate, LeadController.exportCSV);
router.get('/:id', authenticate, leadIdValidator, validate, LeadController.getById);
router.put('/:id', authenticate, requireAccess('leads', 'update'), updateLeadValidator, validate, LeadController.update);
router.delete('/:id', authenticate, requireAccess('leads', 'delete'), leadIdValidator, validate, LeadController.delete);

export default router;
