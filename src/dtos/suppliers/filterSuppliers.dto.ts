import { z } from 'zod';
import { updateSupplierSchema } from './updateSupplier.dto';

export const filterSuppliersSchema = updateSupplierSchema
  .pick({ city: true, country: true, companyName: true })
  .extend({
    isActive: z.enum(['true', 'false']).transform((val) => val === 'true'),
  })
  .partial();

export type FilterSuppliersDto = z.infer<typeof filterSuppliersSchema>;
