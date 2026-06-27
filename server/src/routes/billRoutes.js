import { Router } from 'express';
import {
  createBill,
  getBills,
  getBillById,
  downloadBillPdf,
} from '../controllers/billController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createBillSchema } from '../validators/workflowValidator.js';

const router = Router();

router.get(
  '/:id/pdf',
  authenticate,
  authorize('admin', 'officer', 'owner'),
  downloadBillPdf
);

router.use(authenticate, authorize('admin', 'officer'));

router.post('/', validate(createBillSchema), createBill);
router.get('/', getBills);
router.get('/:id', getBillById);

export default router;
