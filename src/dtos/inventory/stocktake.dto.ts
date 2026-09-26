import z from 'zod';

export const stocktakeSchema = z
  .object({
    actualQuantity: z.number().int().nonnegative(),
  })
  .strict();

export type StocktakeDto = z.infer<typeof stocktakeSchema>;
