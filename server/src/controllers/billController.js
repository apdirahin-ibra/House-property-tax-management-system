import { AppError } from '../middleware/errorHandler.js';
import Assessment from '../models/Assessment.js';
import Bill from '../models/Bill.js';
import Property from '../models/Property.js';
import Owner from '../models/Owner.js';
import { generateBillNo } from '../utils/generateNumbers.js';
import { computeBillBalance, computeBillStatus } from '../utils/billStatus.js';
import {
  getOwnerAssessmentIds,
  assertOwnerOwnsBill,
} from '../services/ownerAccess.js';
import { generateBillPdfBuffer } from '../services/pdfService.js';
import { logAudit, getClientIp } from '../services/auditService.js';

const populateBillQuery = (query) =>
  query
    .populate({
      path: 'assessmentId',
      populate: { path: 'propertyId', populate: { path: 'ownerId' } },
    })
    .populate('issuedBy', 'name email');

export const createBill = async (req, res, next) => {
  try {
    const { assessmentId, dueDate } = req.body;

    const assessment = await Assessment.findById(assessmentId).populate('propertyId');
    if (!assessment) {
      throw new AppError('Assessment not found', 404);
    }

    const existingBill = await Bill.findOne({ assessmentId });
    if (existingBill) {
      throw new AppError('A bill already exists for this assessment', 409);
    }

    const parsedDueDate = new Date(dueDate);
    if (Number.isNaN(parsedDueDate.getTime())) {
      throw new AppError('Invalid due date', 400);
    }

    const amountDue = assessment.totalDue;
    const billNo = await generateBillNo();

    const bill = await Bill.create({
      assessmentId,
      billNo,
      dueDate: parsedDueDate,
      amountDue,
      amountPaid: 0,
      balance: amountDue,
      status: computeBillStatus({
        amountDue,
        amountPaid: 0,
        balance: amountDue,
        dueDate: parsedDueDate,
      }),
      issuedBy: req.user._id,
    });

    const populated = await populateBillQuery(Bill.findById(bill._id));

    await logAudit({
      actorId: req.user._id,
      action: 'CREATE',
      entityType: 'Bill',
      entityId: bill._id,
      description: `Issued bill ${bill.billNo}`,
      ipAddress: getClientIp(req),
    });

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const getBills = async (req, res, next) => {
  try {
    const { status, year, zone, from, to } = req.query;

    let assessmentFilter = {};
    if (year) {
      assessmentFilter.taxYear = Number(year);
    }

    if (zone) {
      const properties = await Property.find({ zone }).select('_id');
      const propertyIds = properties.map((p) => p._id);
      assessmentFilter.propertyId = { $in: propertyIds };
    }

    const assessmentIds =
      Object.keys(assessmentFilter).length > 0
        ? (await Assessment.find(assessmentFilter).select('_id')).map((a) => a._id)
        : null;

    const filter = {};
    if (status) filter.status = status;
    if (assessmentIds) filter.assessmentId = { $in: assessmentIds };
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const bills = await populateBillQuery(Bill.find(filter).sort({ createdAt: -1 }));

    res.json({
      success: true,
      count: bills.length,
      data: bills,
    });
  } catch (error) {
    next(error);
  }
};

export const getBillById = async (req, res, next) => {
  try {
    const bill = await populateBillQuery(Bill.findById(req.params.id));

    if (!bill) {
      throw new AppError('Bill not found', 404);
    }

    res.json({
      success: true,
      data: bill,
    });
  } catch (error) {
    next(error);
  }
};

export const getOwnerBills = async (req, res, next) => {
  try {
    const assessmentIds = await getOwnerAssessmentIds(req.user._id);

    if (!assessmentIds.length) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const { status } = req.query;
    const filter = { assessmentId: { $in: assessmentIds } };
    if (status) filter.status = status;

    const bills = await populateBillQuery(Bill.find(filter).sort({ createdAt: -1 }));

    res.json({
      success: true,
      count: bills.length,
      data: bills,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadBillPdf = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      throw new AppError('Bill not found', 404);
    }

    if (req.user.role === 'owner') {
      await assertOwnerOwnsBill(req.user._id, bill._id);
    }

    const assessment = await Assessment.findById(bill.assessmentId).populate('propertyId');
    const property = assessment.propertyId;
    const owner = await Owner.findById(property.ownerId);

    const buffer = await generateBillPdfBuffer(bill, assessment, property, owner);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${bill.billNo}.pdf"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const refreshBillStatus = async (bill) => {
  bill.balance = computeBillBalance(bill.amountDue, bill.amountPaid);
  bill.status = computeBillStatus({
    amountDue: bill.amountDue,
    amountPaid: bill.amountPaid,
    balance: bill.balance,
    dueDate: bill.dueDate,
    cancelled: bill.status === 'cancelled',
  });
  await bill.save();
  return bill;
};
