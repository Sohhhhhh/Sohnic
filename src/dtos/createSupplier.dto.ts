import { z } from 'zod';

export const createSupplierSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email format'),
      companyName: z.string().min(1).optional(),
      country: z.string().min(1).optional(),
      city: z.string().min(1).optional(),
      phone: z.string().min(1).optional(),
      leadTimeDays: z
        .number()
        .int()
        .min(0, 'Lead Time in days must be a positive number')
        .optional(),
    })
    .strict(),
});

export type CreateSupplierDto = z.infer<typeof createSupplierSchema>['body'];
