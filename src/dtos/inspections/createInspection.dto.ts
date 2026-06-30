import { z } from 'zod';

const baseInspectionSchema = z.object({
  itemId: z.string().uuid(),
  inspectionDate: z.string().date(),
  quantityOrdered: z.number().int().positive(),
  quantityReceived: z.number().int().nonnegative(),
  quantityRejected: z.number().int().nonnegative(),
  defectType: z.string().optional(),
  notes: z.string().optional(),
});

export const orderInspectionSchema = baseInspectionSchema
  .extend({
    type: z.literal('order'),
    orderId: z.string().uuid(),
    inspectionResult: z.enum(['passed', 'failed']),
  })
  .strict();

export const manufacturingInspectionSchema = baseInspectionSchema
  .extend({
    type: z.literal('manufacturing_batch'),
    manufacturingBatchId: z.string().uuid(),
    inspectionResult: z.enum(['passed', 'failed', 'needs_rework']),
  })
  .strict();

export const transferInspectionSchema = baseInspectionSchema
  .extend({
    type: z.literal('transfer'),
    transferOrderId: z.string().uuid(),
    inspectionResult: z.enum(['passed', 'failed']),
  })
  .strict();

export const createInspectionSchema = z.discriminatedUnion('type', [
  orderInspectionSchema,
  manufacturingInspectionSchema,
  transferInspectionSchema,
]);

export type CreateInspectionDto = z.output<typeof createInspectionSchema>;

export type CreateInspectionData = CreateInspectionDto & {
  branchId: string;
  inspectorId: string;
};
