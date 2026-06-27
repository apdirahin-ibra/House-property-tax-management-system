import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema } from '../validators/userValidator.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', getUsers);
router.post('/', validate(createUserSchema), createUser);
router.patch('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', deactivateUser);

export default router;
