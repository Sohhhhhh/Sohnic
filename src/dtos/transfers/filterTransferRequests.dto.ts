import { z } from 'zod';
import { paginationSchema } from '../common/pagination.dto';

export const filterTransferRequestsSchema = z.object({
  fromBranch: z.string().uuid().optional(),
  byBranch: z.string().uuid().optional(),
  dateFrom: z.iso.date().optional(),
  dateTo: z.iso.date().optional(),
  status: z
    .enum([
      'pending',
      'approved',
      'rejected',
      'in_transit',
      'received',
      'completed',
    ])
    .optional(),
});

export const filterTransferRequestsQuerySchema =
  filterTransferRequestsSchema.merge(paginationSchema);

export type FilterTransferRequestsDto = z.output<
  typeof filterTransferRequestsSchema
>;
