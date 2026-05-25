import { z } from 'zod';

export const quotationIdSchema = z
  .object({
    quotationId: z
      .string({ message: 'quotation id must be a string' })
      .uuid({ message: 'quotation id must be a valid uuid' }),
  })
  .strict();

export type QuotationIdDto = z.output<typeof quotationIdSchema>;
