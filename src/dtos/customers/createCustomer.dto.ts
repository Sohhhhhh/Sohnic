import { z } from 'zod';

export const createCustomerSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    type: z
      .enum(['individual', 'business', 'educational'])
      .default('individual'),
    phone: z
      .string()
      .regex(
        /^(01[0125][0-9]{8}|\+201[0125][0-9]{8})$/,
        'Invalid Egyptian phone number',
      ),
  })
  .strict();

export type CreateCustomerDto = z.output<typeof createCustomerSchema>;
