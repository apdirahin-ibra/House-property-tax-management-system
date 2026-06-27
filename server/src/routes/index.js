import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import ownerRoutes from './ownerRoutes.js';
import propertyRoutes from './propertyRoutes.js';
import taxRateRoutes from './taxRateRoutes.js';
import ownerPortalRoutes from './ownerPortalRoutes.js';
import assessmentRoutes from './assessmentRoutes.js';
import billRoutes from './billRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import receiptRoutes from './receiptRoutes.js';
import reportRoutes from './reportRoutes.js';
import auditLogRoutes from './auditLogRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'House Property Tax API is running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/owners', ownerRoutes);
router.use('/properties', propertyRoutes);
router.use('/tax-rates', taxRateRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/bills', billRoutes);
router.use('/payments', paymentRoutes);
router.use('/receipts', receiptRoutes);
router.use('/reports', reportRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/owner', ownerPortalRoutes);

export default router;
