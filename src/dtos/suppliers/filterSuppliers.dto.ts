import { z } from 'zod';
import { updateSupplierBaseSchema } from './updateSupplier.dto';

export const filterSuppliersSchema = updateSupplierBaseSchema
  .pick({ city: true, country: true, companyName: true })
  .extend({
    isActive: z.enum(['true', 'false']).transform((val) => val === 'true'),
  })
  .partial();

export type FilterSuppliersDto = z.infer<typeof filterSuppliersSchema>;
