import { z } from 'zod';
import { createCustomerSchema } from './createCustomer.dto';

export const updateCustomerSchema = createCustomerSchema.partial();

export type UpdateCustomerDto = z.output<typeof updateCustomerSchema>;
