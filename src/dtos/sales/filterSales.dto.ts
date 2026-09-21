import { z } from 'zod';

import { paginationSchema } from '../common/pagination.dto';

export const filterSalesSchema = z.object({
  branchId: z.string().uuid().optional(),
  cashierId: z.string().uuid().optional(),
  customerType: z.enum(['individual', 'business', 'educational']).optional(),
  paymentMethod: z
    .enum([
      'cash',
      'credit_card',
      'debit_card',
      'bank_transfer',
      'mobile_payment',
    ])
    .optional(),
  dateFrom: z.iso.date().optional(),
  dateTo: z.iso.date().optional(),
});

export const filterSalesQuerySchema = filterSalesSchema.merge(paginationSchema);

export type FilterSalesDto = z.output<typeof filterSalesSchema>;
