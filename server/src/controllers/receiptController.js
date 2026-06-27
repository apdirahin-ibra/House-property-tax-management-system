import fs from 'fs';
import { AppError } from '../middleware/errorHandler.js';
import Receipt from '../models/Receipt.js';
import Payment from '../models/Payment.js';
import Bill from '../models/Bill.js';
import Assessment from '../models/Assessment.js';
import { assertOwnerOwnsReceipt } from '../services/ownerAccess.js';
import { generateReceiptPdfBuffer } from '../services/pdfService.js';

export const downloadReceiptPdf = async (req, res, next) => {
  try {
    let receipt;

    if (req.user.role === 'owner') {
      receipt = await assertOwnerOwnsReceipt(req.user._id, req.params.id);
    } else {
      receipt = await Receipt.findById(req.params.id);
      if (!receipt) {
        throw new AppError('Receipt not found', 404);
      }
    }

    if (receipt.pdfPath && fs.existsSync(receipt.pdfPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${receipt.receiptNo}.pdf"`
      );
      return fs.createReadStream(receipt.pdfPath).pipe(res);
    }

    const payment = await Payment.findById(receipt.paymentId);
    const bill = await Bill.findById(payment.billId);
    const assessment = await Assessment.findById(bill.assessmentId).populate({
      path: 'propertyId',
      populate: { path: 'ownerId' },
    });
    const property = assessment.propertyId;
    const owner = property.ownerId;

    const buffer = await generateReceiptPdfBuffer(
      receipt,
      payment,
      bill,
      assessment,
      property,
      owner
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${receipt.receiptNo}.pdf"`
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const verifyReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findOne({ qrToken: req.params.token }).populate({
      path: 'paymentId',
      populate: {
        path: 'billId',
        populate: {
          path: 'assessmentId',
          populate: { path: 'propertyId', populate: { path: 'ownerId' } },
        },
      },
    });

    if (!receipt) {
      throw new AppError('Receipt not found or invalid token', 404);
    }

    const payment = receipt.paymentId;
    const bill = payment.billId;
    const property = bill.assessmentId.propertyId;
    const owner = property.ownerId;

    res.json({
      success: true,
      data: {
        valid: true,
        receiptNo: receipt.receiptNo,
        amountPaid: payment.amountPaid,
        paymentDate: payment.paymentDate,
        method: payment.method,
        billNo: bill.billNo,
        propertyCode: property.propertyCode,
        ownerName: owner.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
};
