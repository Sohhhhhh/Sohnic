import { z } from 'zod';
import { createCustomerSchema } from '../customers/createCustomer.dto';

export const createSaleSchema = z
  .object({
    customerId: z.string().uuid().optional(),
    customer: createCustomerSchema.optional(),
    paymentMethod: z.enum([
      'cash',
      'credit_card',
      'debit_card',
      'bank_transfer',
      'mobile_payment',
    ]),
    items: z
      .array(
        z.object({
          itemId: z.string().uuid(),
          quantity: z.number().int().positive(),
        }),
      )
      .min(1),
  })
  .refine((data) => Boolean(data.customerId) !== Boolean(data.customer), {
    message: 'Provide either customerId or customer details, not both',
  })
  .strict();

export type CreateSaleDto = z.output<typeof createSaleSchema>;

export type CreateSaleData = Omit<
  CreateSaleDto,
  'items' | 'customerId' | 'customer'
> & {
  branchId: string;
  cashierId: string;
  customerId: string;
  amount: string;
};

export type CreateSaleItemData = {
  orderId: string;
  itemId: string;
  quantity: number;
  unitPrice: string;
};
