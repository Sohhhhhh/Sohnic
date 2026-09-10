import { z } from 'zod';
import { paginationSchema } from '../common/pagination.dto';

export const filterManufacturersSchema = z.object({
  country: z.string().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
});

export const manufacturersQuerySchema = paginationSchema.merge(
  filterManufacturersSchema,
);

export type FilterManufacturersDto = z.infer<
  typeof filterManufacturersSchema
>;
export type ManufacturersQueryDto = z.infer<typeof manufacturersQuerySchema>;
