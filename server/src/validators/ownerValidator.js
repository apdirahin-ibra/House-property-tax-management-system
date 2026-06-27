import { z } from 'zod';

export const createOwnerSchema = z.object({
  userId: z.string().optional().nullable(),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(5, 'Phone is required'),
  email: z.string().email().optional().nullable(),
  nationalId: z.string().optional().nullable(),
  address: z.string().min(3, 'Address is required'),
});

export const updateOwnerSchema = z
  .object({
    userId: z.string().optional().nullable(),
    fullName: z.string().min(2).optional(),
    phone: z.string().min(5).optional(),
    email: z.string().email().optional().nullable(),
    nationalId: z.string().optional().nullable(),
    address: z.string().min(3).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });
