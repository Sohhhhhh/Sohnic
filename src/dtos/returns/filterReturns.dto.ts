import z from 'zod';

import { paginationSchema } from '../common/pagination.dto';

export const filterReturnsSchema = z.object({
  type: z.enum(['supplier', 'manufacturer', 'transfer']).optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'completed']).optional(),
  inspectionId: z.string().uuid().optional(),
  inspectorId: z.string().uuid().optional(),
});

export const filterReturnsQuerySchema =
  filterReturnsSchema.merge(paginationSchema);
export type FilterReturnsDto = z.output<typeof filterReturnsSchema>;
