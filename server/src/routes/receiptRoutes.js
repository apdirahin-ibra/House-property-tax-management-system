import { Router } from 'express';
import {
  downloadReceiptPdf,
  verifyReceipt,
} from '../controllers/receiptController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/verify/:token', verifyReceipt);

router.get(
  '/:id/pdf',
  authenticate,
  authorize('admin', 'officer', 'owner'),
  downloadReceiptPdf
);

export default router;
