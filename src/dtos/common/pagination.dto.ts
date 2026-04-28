import { z } from 'zod';

export const paginationSchema = z
  .object({
    page: z.coerce
      .number()
      .min(1, 'page must be a positive number')
      .optional()
      .default(1),
    limit: z.coerce
      .number()
      .min(1, 'limit must be larger than or equal 1')
      .max(100, 'limit must be smaller than or equal 100')
      .optional()
      .default(10),
  })
  .strict();

export type PaginationDto = z.output<typeof paginationSchema>;
