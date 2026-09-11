import { z } from 'zod';

export const createManufacturingOrderSchema = z
  .object({
    productId: z.string().uuid(),
    manufacturerId: z.string().uuid(),
    quantity: z.number().int().positive(),
    expectedCompletionDate: z.iso.date().optional(),
    totalManufacturingCost: z
      .number()
      .nonnegative()
      .transform((v) => v.toFixed(2))
      .optional(),
    notes: z.string().optional(),
  })
  .strict();

export type CreateManufacturingOrderDto = z.output<
  typeof createManufacturingOrderSchema
>;

/** Shape passed to the repository after injecting createdById from auth */
export type CreateManufacturingOrderData = CreateManufacturingOrderDto & {
  createdById: string;
};
