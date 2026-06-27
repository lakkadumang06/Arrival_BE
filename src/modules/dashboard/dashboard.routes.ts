import { Router } from 'express';
import { LeadController } from '../leads/lead.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/stats', authenticate, LeadController.getStats);
router.get('/recent-leads', authenticate, LeadController.getRecent);

export default router;
