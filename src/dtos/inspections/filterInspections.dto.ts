import z from 'zod';

import { paginationSchema } from '../common/pagination.dto';

export const filterInspectionsSchema = z.object({
  type: z.enum(['order', 'manufacturing_batch', 'transfer']).optional(),
  inspectionResult: z.enum(['passed', 'failed', 'needs_rework']).optional(),
  itemId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional(),
  inspectorId: z.string().uuid().optional(),
});

export const filterInspectionsQuerySchema =
  filterInspectionsSchema.merge(paginationSchema);
export type FilterInspectionsDto = z.output<typeof filterInspectionsSchema>;
