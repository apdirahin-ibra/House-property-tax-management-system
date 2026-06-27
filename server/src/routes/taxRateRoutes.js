import { Router } from 'express';
import {
  getTaxRates,
  createTaxRate,
  updateTaxRate,
  deleteTaxRate,
} from '../controllers/taxRateController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createTaxRateSchema,
  updateTaxRateSchema,
} from '../validators/taxRateValidator.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin', 'officer'), getTaxRates);
router.post('/', authorize('admin'), validate(createTaxRateSchema), createTaxRate);
router.patch('/:id', authorize('admin'), validate(updateTaxRateSchema), updateTaxRate);
router.delete('/:id', authorize('admin'), deleteTaxRate);

export default router;
