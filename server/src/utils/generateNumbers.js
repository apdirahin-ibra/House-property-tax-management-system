import Bill from '../models/Bill.js';
import Receipt from '../models/Receipt.js';

export const generateBillNo = async () => {
  const year = new Date().getFullYear();
  const prefix = `BILL-${year}-`;
  const count = await Bill.countDocuments({ billNo: { $regex: `^${prefix}` } });
  return `${prefix}${String(count + 1).padStart(5, '0')}`;
};

export const generateReceiptNo = async () => {
  const year = new Date().getFullYear();
  const prefix = `RCT-${year}-`;
  const count = await Receipt.countDocuments({ receiptNo: { $regex: `^${prefix}` } });
  return `${prefix}${String(count + 1).padStart(5, '0')}`;
};
