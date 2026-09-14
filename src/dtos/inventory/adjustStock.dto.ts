import { z } from 'zod';

export const adjustStockSchema = z
  .object({
    quantity: z.number().int(),
  })
  .strict();

export type AdjustStockDto = z.infer<typeof adjustStockSchema>;
