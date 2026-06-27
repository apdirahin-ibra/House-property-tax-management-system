import { Router } from 'express';
import {
  createPayment,
  getPayments,
} from '../controllers/paymentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPaymentSchema } from '../validators/workflowValidator.js';

const router = Router();

router.use(authenticate, authorize('admin', 'officer'));

router.post('/', validate(createPaymentSchema), createPayment);
router.get('/', getPayments);

export default router;
