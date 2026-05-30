import z from 'zod';

import { paginationSchema } from '../common/pagination.dto';

export const filterPurchaseOrdersSchema = z.object({
  status: z
    .enum(['pending', 'approved', 'shipped', 'delivered', 'cancelled'])
    .optional(),
  supplierId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional(),
});

export const filterPurchaseOrdersQuerySchema =
  filterPurchaseOrdersSchema.merge(paginationSchema);
export type FilterPurchaseOrdersDto = z.output<
  typeof filterPurchaseOrdersSchema
>;
