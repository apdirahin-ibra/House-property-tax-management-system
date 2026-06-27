import Owner from '../models/Owner.js';
import Property from '../models/Property.js';
import Assessment from '../models/Assessment.js';
import Bill from '../models/Bill.js';
import Payment from '../models/Payment.js';
import Receipt from '../models/Receipt.js';
import { AppError } from '../middleware/errorHandler.js';

export const getOwnerProfile = async (userId) => {
  return Owner.findOne({ userId });
};

export const getOwnerPropertyIds = async (userId) => {
  const owner = await getOwnerProfile(userId);
  if (!owner) return [];

  const properties = await Property.find({ ownerId: owner._id }).select('_id');
  return properties.map((p) => p._id);
};

export const getOwnerAssessmentIds = async (userId) => {
  const propertyIds = await getOwnerPropertyIds(userId);
  if (!propertyIds.length) return [];

  const assessments = await Assessment.find({ propertyId: { $in: propertyIds } }).select('_id');
  return assessments.map((a) => a._id);
};

export const getOwnerBillIds = async (userId) => {
  const assessmentIds = await getOwnerAssessmentIds(userId);
  if (!assessmentIds.length) return [];

  const bills = await Bill.find({ assessmentId: { $in: assessmentIds } }).select('_id');
  return bills.map((b) => b._id);
};

export const assertOwnerOwnsBill = async (userId, billId) => {
  const billIds = await getOwnerBillIds(userId);
  const owns = billIds.some((id) => id.toString() === billId.toString());

  if (!owns) {
    throw new AppError('You do not have access to this bill', 403);
  }
};

export const assertOwnerOwnsReceipt = async (userId, receiptId) => {
  const receipt = await Receipt.findById(receiptId).populate({
    path: 'paymentId',
    populate: { path: 'billId' },
  });

  if (!receipt) {
    throw new AppError('Receipt not found', 404);
  }

  const billId = receipt.paymentId?.billId?._id || receipt.paymentId?.billId;
  if (!billId) {
    throw new AppError('Receipt not found', 404);
  }

  await assertOwnerOwnsBill(userId, billId);
  return receipt;
};

export const getOwnerPaymentFilter = async (userId) => {
  const billIds = await getOwnerBillIds(userId);
  return { billId: { $in: billIds } };
};
