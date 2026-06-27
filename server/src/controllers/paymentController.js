import crypto from 'crypto';
import { AppError } from '../middleware/errorHandler.js';
import Bill from '../models/Bill.js';
import Payment from '../models/Payment.js';
import Receipt from '../models/Receipt.js';
import { computeBillBalance, computeBillStatus } from '../utils/billStatus.js';
import { generateReceiptNo } from '../utils/generateNumbers.js';
import {
  generateReceiptPdfBuffer,
  saveReceiptPdf,
} from '../services/pdfService.js';
import { assertOwnerOwnsBill, getOwnerPaymentFilter } from '../services/ownerAccess.js';
import { logAudit, getClientIp } from '../services/auditService.js';

const populatePaymentQuery = (query) =>
  query
    .populate({
      path: 'billId',
      populate: {
        path: 'assessmentId',
        populate: { path: 'propertyId', populate: { path: 'ownerId' } },
      },
    })
    .populate('recordedBy', 'name email');

async function attachReceipts(payments) {
  const list = Array.isArray(payments) ? payments : [payments];
  const paymentIds = list.map((p) => p._id);
  const receipts = await Receipt.find({ paymentId: { $in: paymentIds } });
  const receiptMap = new Map(receipts.map((r) => [r.paymentId.toString(), r]));

  return list.map((payment) => {
    const obj = payment.toObject ? payment.toObject() : { ...payment };
    obj.receipt = receiptMap.get(payment._id.toString()) || null;
    return obj;
  });
}

async function recordPayment({
  billId,
  amountPaid,
  method,
  referenceNo,
  paymentDate,
  recordedBy,
  actorId,
  auditDescription,
  req,
}) {
    const bill = await Bill.findById(billId);
    if (!bill) {
      throw new AppError('Bill not found', 404);
    }

    if (bill.status === 'cancelled') {
      throw new AppError('Cannot pay a cancelled bill', 400);
    }

    if (bill.status === 'paid' || bill.balance <= 0) {
      throw new AppError('Bill is already fully paid', 400);
    }

    if (amountPaid > bill.balance) {
      throw new AppError(`Payment exceeds outstanding balance of ${bill.balance}`, 400);
    }

    const payment = await Payment.create({
      billId,
      amountPaid,
      method,
      referenceNo: referenceNo || undefined,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      recordedBy,
    });

    bill.amountPaid = Math.round((bill.amountPaid + amountPaid) * 100) / 100;
    bill.balance = computeBillBalance(bill.amountDue, bill.amountPaid);
    bill.status = computeBillStatus({
      amountDue: bill.amountDue,
      amountPaid: bill.amountPaid,
      balance: bill.balance,
      dueDate: bill.dueDate,
    });
    await bill.save();

    const receiptNo = await generateReceiptNo();
    const qrToken = crypto.randomUUID();

    const receipt = await Receipt.create({
      paymentId: payment._id,
      receiptNo,
      qrToken,
    });

    const populatedPayment = await populatePaymentQuery(Payment.findById(payment._id));

    try {
      const assessment = populatedPayment.billId.assessmentId;
      const property = assessment.propertyId;
      const owner = property.ownerId;

      const pdfBuffer = await generateReceiptPdfBuffer(
        receipt,
        payment,
        bill,
        assessment,
        property,
        owner
      );
      const pdfPath = await saveReceiptPdf(receiptNo, pdfBuffer);
      receipt.pdfPath = pdfPath;
      await receipt.save();
    } catch (pdfError) {
      console.error('Receipt PDF generation failed:', pdfError.message);
    }

    await logAudit({
      actorId,
      action: 'CREATE',
      entityType: 'Payment',
      entityId: payment._id,
      description: auditDescription || `Recorded payment of ${amountPaid} for bill ${bill.billNo}`,
      ipAddress: getClientIp(req),
    });

    return { payment: populatedPayment, receipt, bill };
}

export const createPayment = async (req, res, next) => {
  try {
    const { billId, amountPaid, method, referenceNo, paymentDate } = req.body;
    const data = await recordPayment({
      billId,
      amountPaid,
      method,
      referenceNo,
      paymentDate,
      recordedBy: req.user._id,
      actorId: req.user._id,
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createOwnerPayment = async (req, res, next) => {
  try {
    const { billId, amountPaid, provider, phone, referenceNo } = req.body;

    await assertOwnerOwnsBill(req.user._id, billId);

    const providerLabel = provider === 'evc' ? 'EVC Plus' : 'eDahab';
    const generatedReference =
      referenceNo ||
      `${provider.toUpperCase()}-${Date.now()}-${String(phone).slice(-4)}`;

    const data = await recordPayment({
      billId,
      amountPaid,
      method: 'mobile_money',
      referenceNo: generatedReference,
      recordedBy: req.user._id,
      actorId: req.user._id,
      auditDescription: `Owner paid ${amountPaid} for bill via ${providerLabel} (${phone})`,
      req,
    });

    res.status(201).json({
      success: true,
      message: `Payment completed with ${providerLabel}`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    const { method, from, to } = req.query;
    const filter = {};

    if (method) filter.method = method;
    if (from || to) {
      filter.paymentDate = {};
      if (from) filter.paymentDate.$gte = new Date(from);
      if (to) filter.paymentDate.$lte = new Date(to);
    }

    const payments = await populatePaymentQuery(
      Payment.find(filter).sort({ paymentDate: -1 })
    );
    const data = await attachReceipts(payments);

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getOwnerPayments = async (req, res, next) => {
  try {
    const filter = await getOwnerPaymentFilter(req.user._id);

    if (!filter.billId.$in.length) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const payments = await populatePaymentQuery(
      Payment.find(filter).sort({ paymentDate: -1 })
    );
    const data = await attachReceipts(payments);

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};
