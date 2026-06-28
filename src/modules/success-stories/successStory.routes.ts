import { Router } from 'express';
import { SuccessStoryController } from './successStory.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { upload } from '../../middleware/upload';

const router = Router();

// ── Public (homepage) ──────────────────────────────────────────────
router.get('/public', SuccessStoryController.getEnabled);
router.get('/latest', SuccessStoryController.getLatest); // Feature 3: latest 7

// ── Protected (admin panel) ────────────────────────────────────────
router.get('/', authenticate, SuccessStoryController.getAll);

// Feature 2: image upload — multipart/form-data, file field name "image".
// upload.single parses the file into req.file before the controller runs.
router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  SuccessStoryController.create
);

router.get('/:id', authenticate, SuccessStoryController.getById);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  SuccessStoryController.update
);

router.delete('/:id', authenticate, authorize('admin'), SuccessStoryController.delete);

export default router;
