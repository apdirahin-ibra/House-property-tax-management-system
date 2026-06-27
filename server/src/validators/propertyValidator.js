import { z } from 'zod';

export const createPropertySchema = z.object({
  ownerId: z.string().min(1, 'Owner is required'),
  propertyCode: z.string().min(2, 'Property code is required').optional(),
  district: z.string().min(2, 'District is required'),
  zone: z.string().min(1, 'Zone is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  sizeSqm: z.number().min(0).optional().nullable(),
  assessedValue: z.number().min(0, 'Assessed value must be positive'),
  usageStatus: z.enum(['occupied', 'vacant', 'rented']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updatePropertySchema = z
  .object({
    ownerId: z.string().optional(),
    district: z.string().min(2).optional(),
    zone: z.string().min(1).optional(),
    propertyType: z.string().min(1).optional(),
    sizeSqm: z.number().min(0).optional().nullable(),
    assessedValue: z.number().min(0).optional(),
    usageStatus: z.enum(['occupied', 'vacant', 'rented']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });
