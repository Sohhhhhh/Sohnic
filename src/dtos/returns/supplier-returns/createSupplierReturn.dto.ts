import { z } from 'zod';

export const createSupplierReturnSchema = z
  .object({
    inspectionId: z.string().uuid(),
    reason: z.string().optional(),
  })
  .strict();

export type CreateSupplierReturnDto = z.output<
  typeof createSupplierReturnSchema
>;

export type CreateSupplierReturnData = CreateSupplierReturnDto & {
  supplierId: string;
  purchaseOrderId: string;
  itemId: string;
  quantity: number;
  inspectorId: string;
};
