import z from 'zod';
import { paginationSchema } from '../common/pagination.dto';

export const filterManufacturingOrdersSchema = z.object({
  status: z
    .enum([
      'pending',
      'approved',
      'rejected',
      'materials_sent',
      'in_production',
      'completed',
      'cancelled',
    ])
    .optional(),
  manufacturerId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  createdById: z.string().uuid().optional(),
  dateFrom: z.iso.date().optional(),
  dateTo: z.iso.date().optional(),
});

export const filterManufacturingOrdersQuerySchema =
  filterManufacturingOrdersSchema.merge(paginationSchema);
export type FilterManufacturingOrdersDto = z.output<
  typeof filterManufacturingOrdersQuerySchema
>;
