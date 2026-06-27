import Assessment from '../models/Assessment.js';
import Bill from '../models/Bill.js';
import Payment from '../models/Payment.js';
import Property from '../models/Property.js';

export async function resolveAssessmentIds({ taxYear, zone, propertyType } = {}) {
  const propertyFilter = {};
  if (zone) propertyFilter.zone = zone;
  if (propertyType) propertyFilter.propertyType = propertyType;

  let propertyIds = null;
  if (Object.keys(propertyFilter).length > 0) {
    const properties = await Property.find(propertyFilter).select('_id');
    propertyIds = properties.map((property) => property._id);
    if (!propertyIds.length) return [];
  }

  const assessmentFilter = {};
  if (taxYear) assessmentFilter.taxYear = Number(taxYear);
  if (propertyIds) assessmentFilter.propertyId = { $in: propertyIds };

  if (Object.keys(assessmentFilter).length === 0) {
    return null;
  }

  const assessments = await Assessment.find(assessmentFilter).select('_id');
  return assessments.map((assessment) => assessment._id);
}

export function buildBillFilter({ assessmentIds, status, from, to } = {}) {
  const filter = {};
  if (Array.isArray(assessmentIds)) {
    filter.assessmentId = { $in: assessmentIds };
  }
  if (status) filter.status = status;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  return filter;
}

export async function getBillIdsForFilter(query) {
  const assessmentIds = await resolveAssessmentIds(query);
  if (Array.isArray(assessmentIds) && assessmentIds.length === 0) {
    return [];
  }

  const bills = await Bill.find(buildBillFilter({ ...query, assessmentIds })).select('_id');
  return bills.map((bill) => bill._id);
}

export function summarizeBills(bills) {
  return bills.reduce(
    (summary, bill) => {
      summary.totalBills += 1;
      summary.totalBilled += bill.amountDue || 0;
      summary.totalCollected += bill.amountPaid || 0;
      summary.totalOutstanding += bill.balance || 0;

      if (bill.status === 'paid') summary.paidCount += 1;
      if (bill.status === 'unpaid') summary.unpaidCount += 1;
      if (bill.status === 'partial') summary.partialCount += 1;
      if (bill.status === 'overdue') summary.overdueCount += 1;

      return summary;
    },
    {
      totalBills: 0,
      totalBilled: 0,
      totalCollected: 0,
      totalOutstanding: 0,
      paidCount: 0,
      unpaidCount: 0,
      partialCount: 0,
      overdueCount: 0,
    }
  );
}

const populateBillQuery = (query) =>
  query.populate({
    path: 'assessmentId',
    populate: { path: 'propertyId', populate: { path: 'ownerId', select: 'fullName phone' } },
  });

const populatePaymentQuery = (query) =>
  query.populate({
    path: 'billId',
    populate: {
      path: 'assessmentId',
      populate: { path: 'propertyId', populate: { path: 'ownerId', select: 'fullName' } },
    },
  });

export async function fetchFilteredBills(query) {
  const assessmentIds = await resolveAssessmentIds(query);
  if (Array.isArray(assessmentIds) && assessmentIds.length === 0) {
    return [];
  }

  return populateBillQuery(
    Bill.find(buildBillFilter({ ...query, assessmentIds })).sort({ createdAt: -1 })
  );
}

export async function fetchFilteredPayments(query) {
  const { method, from, to } = query;
  const billIds = await getBillIdsForFilter(query);

  if (Array.isArray(billIds) && billIds.length === 0) {
    return [];
  }

  const filter = {};
  if (Array.isArray(billIds)) filter.billId = { $in: billIds };
  if (method) filter.method = method;
  if (from || to) {
    filter.paymentDate = {};
    if (from) filter.paymentDate.$gte = new Date(from);
    if (to) filter.paymentDate.$lte = new Date(to);
  }

  return populatePaymentQuery(Payment.find(filter).sort({ paymentDate: -1 }));
}

export async function fetchOutstandingBills(query) {
  const assessmentIds = await resolveAssessmentIds(query);
  if (Array.isArray(assessmentIds) && assessmentIds.length === 0) {
    return [];
  }

  const filter = buildBillFilter({ ...query, assessmentIds });
  filter.balance = { $gt: 0 };
  filter.status = query.status || { $in: ['unpaid', 'partial', 'overdue'] };

  return populateBillQuery(Bill.find(filter).sort({ dueDate: 1 }));
}

export async function fetchReportByZone({ taxYear } = {}) {
  const pipeline = [
    {
      $lookup: {
        from: 'assessments',
        localField: 'assessmentId',
        foreignField: '_id',
        as: 'assessment',
      },
    },
    { $unwind: '$assessment' },
    {
      $lookup: {
        from: 'properties',
        localField: 'assessment.propertyId',
        foreignField: '_id',
        as: 'property',
      },
    },
    { $unwind: '$property' },
  ];

  if (taxYear) {
    pipeline.push({ $match: { 'assessment.taxYear': Number(taxYear) } });
  }

  pipeline.push(
    {
      $group: {
        _id: '$property.zone',
        propertyIds: { $addToSet: '$property._id' },
        totalBilled: { $sum: '$amountDue' },
        totalCollected: { $sum: '$amountPaid' },
        outstanding: { $sum: '$balance' },
        billCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        zone: '$_id',
        propertyCount: { $size: '$propertyIds' },
        totalBilled: 1,
        totalCollected: 1,
        outstanding: 1,
        billCount: 1,
      },
    },
    { $sort: { zone: 1 } }
  );

  return Bill.aggregate(pipeline);
}

export async function countPropertiesForReport(query) {
  const filter = { status: 'active' };
  if (query.zone) filter.zone = query.zone;
  if (query.propertyType) filter.propertyType = query.propertyType;

  if (query.taxYear) {
    const assessmentIds = await resolveAssessmentIds(query);
    if (Array.isArray(assessmentIds) && assessmentIds.length === 0) {
      return 0;
    }
    if (Array.isArray(assessmentIds)) {
      const assessments = await Assessment.find({ _id: { $in: assessmentIds } }).select('propertyId');
      const propertyIds = [...new Set(assessments.map((assessment) => String(assessment.propertyId)))];
      return propertyIds.length;
    }
  }

  return Property.countDocuments(filter);
}
