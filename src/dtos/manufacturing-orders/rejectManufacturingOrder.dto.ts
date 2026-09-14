import z from 'zod';

export const rejectManufacturingOrderSchema = z.object({
  rejectionReason: z.string().min(1),
});

export type RejectManufacturingOrderDto = z.infer<
  typeof rejectManufacturingOrderSchema
>;
