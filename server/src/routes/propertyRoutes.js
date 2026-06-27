import { Router } from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
} from '../controllers/propertyController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createPropertySchema,
  updatePropertySchema,
} from '../validators/propertyValidator.js';

const router = Router();

router.use(authenticate, authorize('admin', 'officer'));

router.get('/', getProperties);
router.post('/', validate(createPropertySchema), createProperty);
router.get('/:id', getPropertyById);
router.patch('/:id', validate(updatePropertySchema), updateProperty);

export default router;
