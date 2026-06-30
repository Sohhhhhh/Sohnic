import z from 'zod';

import { paginationSchema } from '../../common/pagination.dto';

export const filterSupplierReturnsSchema = z.object({
  itemId: z.string().uuid().optional(),
  supplierId: z.string().uuid().optional(),
  purchaseOrderId: z.string().uuid().optional(),
});

export const filterSupplierReturnsQuerySchema =
  filterSupplierReturnsSchema.merge(paginationSchema);
export type FilterSupplierReturnsDto = z.output<
  typeof filterSupplierReturnsSchema
>;
