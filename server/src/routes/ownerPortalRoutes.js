import { Router } from 'express';
import { getOwnerProperties } from '../controllers/propertyController.js';
import { getOwnerBills } from '../controllers/billController.js';
import { createOwnerPayment, getOwnerPayments } from '../controllers/paymentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ownerPaymentSchema } from '../validators/workflowValidator.js';

const router = Router();

router.use(authenticate, authorize('owner'));

router.get('/properties', getOwnerProperties);
router.get('/bills', getOwnerBills);
router.get('/payments', getOwnerPayments);
router.post('/payments', validate(ownerPaymentSchema), createOwnerPayment);

export default router;
