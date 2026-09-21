import z from 'zod';
import { createCustomerSchema } from './createCustomer.dto';

export const findCustomerByPhoneSchema = createCustomerSchema
  .pick({ phone: true })
  .strict();

export type findCustomerByPhoneDto = z.output<typeof findCustomerByPhoneSchema>;
