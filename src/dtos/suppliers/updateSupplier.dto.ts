import { z } from 'zod';
import { createSupplierSchema } from './createSupplier.dto';

export const updateSupplierSchema = z.object({
  body: createSupplierSchema.shape.body
    .omit({
      email: true,
      name: true,
    })
    .strict(),
});

export type UpdateSupplierDto = z.infer<typeof updateSupplierSchema>['body'];
