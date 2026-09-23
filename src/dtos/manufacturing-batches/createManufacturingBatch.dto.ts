import { z } from 'zod';

export const createManufacturingBatchSchema = z
  .object({
    quantityProduced: z.number().int().positive(),
    productionDate: z.iso.date().optional(),
    notes: z.string().optional(),
  })
  .strict();

export type CreateManufacturingBatchDto = z.output<
  typeof createManufacturingBatchSchema
>;

export type CreateManufacturingBatchData = CreateManufacturingBatchDto & {
  manufacturingOrderId: string;
  receivedById: string;
};
