import { z } from 'zod';

export const generateAssessmentSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  taxYear: z.number().int().min(2000, 'Valid tax year is required'),
  penalty: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
});

export const createBillSchema = z.object({
  assessmentId: z.string().min(1, 'Assessment is required'),
  dueDate: z.string().min(1, 'Due date is required'),
});

export const createPaymentSchema = z.object({
  billId: z.string().min(1, 'Bill is required'),
  amountPaid: z.number().positive('Amount must be greater than zero'),
  method: z.enum(['cash', 'bank', 'mobile_money', 'other']),
  referenceNo: z.string().optional().nullable(),
  paymentDate: z.string().optional(),
});

export const ownerPaymentSchema = z.object({
  billId: z.string().min(1, 'Bill is required'),
  amountPaid: z.number().positive('Amount must be greater than zero'),
  provider: z.enum(['evc', 'edahab']),
  phone: z.string().min(7, 'Payment phone is required'),
  referenceNo: z.string().optional().nullable(),
});
