import { z } from 'zod';
import { addItemSupplierSchema } from './addItemSupplier.dto';

export const editItemSupplierSchema = addItemSupplierSchema.partial({
  price: true,
  leadTimeDays: true,
}).omit({
  isPrimary: true, itemId: true
});

export type EditItemSupplierDto = z.infer<typeof editItemSupplierSchema>;
