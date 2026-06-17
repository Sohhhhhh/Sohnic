import { z } from 'zod';

export const createPurchaseOrderSchema = z
  .object({
    quotationId: z
      .string()
      .uuid({ message: 'Quotation id must be a valid uuid' }),
  })
  .strict();

export type CreatePurchaseOrderDto = z.output<typeof createPurchaseOrderSchema>;

export type CreatePurchaseOrderData = {
  quotationId: string;
  supplierId: string;
  branchId: string;
  totalPrice: string;
  createdById: string;
};

export type CreatePurchaseOrderItemData = {
  orderId: string;
  itemId: string;
  quantity: number;
  unitPrice: string;
};
