import { z } from 'zod';
import { paginationSchema } from '../common/pagination.dto';

export const filterItemSuppliersSchema = z.object({
  isPrimary: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
});

export const itemSuppliersQuerySchema = paginationSchema.merge(
  filterItemSuppliersSchema,
);

export type FilterItemSuppliersDto = z.infer<typeof filterItemSuppliersSchema>;
export type ItemSuppliersQueryDto = z.infer<typeof itemSuppliersQuerySchema>;
