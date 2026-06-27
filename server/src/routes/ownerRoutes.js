import { Router } from 'express';
import {
  getOwners,
  getOwnerById,
  createOwner,
  updateOwner,
} from '../controllers/ownerController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOwnerSchema, updateOwnerSchema } from '../validators/ownerValidator.js';

const router = Router();

router.use(authenticate, authorize('admin', 'officer'));

router.get('/', getOwners);
router.post('/', validate(createOwnerSchema), createOwner);
router.get('/:id', getOwnerById);
router.patch('/:id', validate(updateOwnerSchema), updateOwner);

export default router;
