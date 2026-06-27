import { z } from 'zod';

export const createTaxRateSchema = z.object({
  zone: z.string().min(1, 'Zone is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  taxYear: z.number().int().min(2000, 'Valid tax year is required'),
  rateType: z.enum(['fixed', 'percentage']),
  rateValue: z.number().min(0, 'Rate value must be positive'),
});

export const updateTaxRateSchema = z
  .object({
    zone: z.string().min(1).optional(),
    propertyType: z.string().min(1).optional(),
    taxYear: z.number().int().min(2000).optional(),
    rateType: z.enum(['fixed', 'percentage']).optional(),
    rateValue: z.number().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });
