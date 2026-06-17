import { z } from 'zod';

export const createSupplierQuotationSchema = z
  .object({
    supplierId: z
      .string({ message: 'Supplier id must be a string' })
      .uuid({ message: 'Supplier id must be a valid uuid' }),
    leadTimeDays: z.number().int().positive(),
    validUntil: z
      .string()
      .date()
      .refine(
        (dateStr) => {
          const today = new Date().toISOString().split('T')[0];
          return dateStr > today;
        },
        { message: 'validUntil must be later than today' },
      ), // YYYY-MM-DD
    items: z
      .array(
        z.object({
          itemId: z.string().uuid(),
          quantity: z.number().int().positive(),
          unitPrice: z
            .number()
            .positive()
            .transform((val) => String(val)),
          notes: z.string().optional(),
        }),
      )
      .min(1),
  })
  .strict();

export type CreateSupplierQuotationDto = z.output<
  typeof createSupplierQuotationSchema
>;

export type CreateSupplierQuotationData = Omit<
  CreateSupplierQuotationDto,
  'items'
> & {
  purchaseRequestId: string;
};

export type CreateSupplierQuotationItemData =
  CreateSupplierQuotationDto['items'][number] & {
    quotationId: string;
  };
