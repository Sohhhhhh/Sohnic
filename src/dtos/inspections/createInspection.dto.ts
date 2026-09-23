import { z } from 'zod';

const baseInspectionSchema = z.object({
  itemId: z.string().uuid(),
  inspectionDate: z.coerce.date(),
  quantityOrdered: z.number().int().positive(),
  quantityReceived: z.number().int().nonnegative(),
  quantityRejected: z.number().int().nonnegative(),
  defectType: z.string().optional(),
  notes: z.string().optional(),
});

export const orderInspectionSchema = baseInspectionSchema.extend({
  type: z.literal('order'),
  orderId: z.string().uuid(),
  inspectionResult: z.enum(['passed', 'failed']),
});

export const manufacturingInspectionSchema = baseInspectionSchema.extend({
  type: z.literal('manufacturing_batch'),
  manufacturingBatchId: z.string().uuid(),
  inspectionResult: z.enum(['passed', 'failed', 'needs_rework']),
});

export const transferInspectionSchema = baseInspectionSchema.extend({
  type: z.literal('transfer'),
  transferRequestId: z.string().uuid(),
  inspectionResult: z.enum(['passed', 'failed']),
});

export const createInspectionSchema = z
  .discriminatedUnion('type', [
    orderInspectionSchema,
    manufacturingInspectionSchema,
    transferInspectionSchema,
  ])
  .superRefine((data, ctx) => {
    if (data.inspectionResult !== 'passed' && !data.defectType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'defectType is required when result is failed or needs_rework',
        path: ['defectType'],
      });
    }

    if (data.quantityRejected > data.quantityReceived) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'quantityRejected cannot exceed quantityReceived',
        path: ['quantityRejected'],
      });
    }
  });

export type CreateInspectionDto = z.output<typeof createInspectionSchema>;

export type CreateInspectionData = CreateInspectionDto & {
  branchId: string;
  inspectorId: string;
};
