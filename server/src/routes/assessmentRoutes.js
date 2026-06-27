import { Router } from 'express';
import {
  generateAssessment,
  getAssessments,
  getAssessmentById,
} from '../controllers/assessmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { generateAssessmentSchema } from '../validators/workflowValidator.js';

const router = Router();

router.use(authenticate, authorize('admin', 'officer'));

router.post('/generate', validate(generateAssessmentSchema), generateAssessment);
router.get('/', getAssessments);
router.get('/:id', getAssessmentById);

export default router;
