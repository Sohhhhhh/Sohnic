import { z } from 'zod';
import { createSupplierSchema } from './createSupplier.dto';

export const updateSupplierSchema = createSupplierSchema
  .omit({
    email: true,
    name: true,
  })
  .strict();

export type UpdateSupplierDto = z.infer<typeof updateSupplierSchema>;
