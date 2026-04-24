import { z } from 'zod';
import { addItemSupplierSchema } from './addItemSupplier.dto';

export const editItemSupplierSchema = z.object({
  body: addItemSupplierSchema.shape.body.partial({
    price: true,
    leadTimeDays: true,
  }),
});

export type editItemSupplierDto = z.infer<
  typeof editItemSupplierSchema
>['body'];
