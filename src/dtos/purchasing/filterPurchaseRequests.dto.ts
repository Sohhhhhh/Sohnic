import { z } from 'zod';
import { paginationSchema } from '../common/pagination.dto';

export const filterPurchaseRequestsSchema = z.object({
  branchId: z.string().uuid().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export const filterPurchaseRequestsQuerySchema =
  filterPurchaseRequestsSchema.merge(paginationSchema);

export type FilterPurchaseRequestsDto = z.output<
  typeof filterPurchaseRequestsSchema
>;
