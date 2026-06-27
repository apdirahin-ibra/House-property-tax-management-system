import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', getAuditLogs);

export default router;
