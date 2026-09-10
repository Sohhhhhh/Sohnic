import { z } from 'zod';
import { createSupplierSchema } from './createSupplier.dto';

export const updateSupplierBaseSchema = createSupplierSchema
  .omit({
    email: true,
    name: true,
  })
  .strict();

export const updateSupplierSchema = updateSupplierBaseSchema.refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided to update.' },
);

export type UpdateSupplierDto = z.infer<typeof updateSupplierSchema>;
