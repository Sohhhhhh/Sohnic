import { z } from 'zod';

export const addItemSupplierSchema = z.object({
  body: z
    .object({
      itemId: z.string().uuid('item id must be a valid uuid'),
      price: z
        .number()
        .min(1, 'Price must be a positive value')
        .multipleOf(0.01, 'Price can only have 2 decimal places'),
      isPrimary: z.boolean().optional().default(false),
      leadTimeDays: z
        .number()
        .int()
        .min(0, 'Lead Time in days must be a positive number'),
    })
    .strict(),
});

export type AddItemSupplierDto = z.infer<typeof addItemSupplierSchema>['body'];
