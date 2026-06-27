import { Router } from 'express';
import {
  downloadAllReportsPdf,
  getByZoneReport,
  getCollectionsReport,
  getOutstandingReport,
  getSummaryReport,
} from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorize('admin', 'officer'));

router.get('/summary', getSummaryReport);
router.get('/collections', getCollectionsReport);
router.get('/outstanding', getOutstandingReport);
router.get('/by-zone', getByZoneReport);
router.get('/all/pdf', downloadAllReportsPdf);

export default router;
