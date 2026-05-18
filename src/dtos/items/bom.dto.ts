import { z } from 'zod';

export const addBomComponentSchema = z
  .object({
    componentId: z.string().uuid(),
    quantityPerUnit: z.number().int().positive(),
  })
  .strict();

export type AddBomComponentDto = z.output<typeof addBomComponentSchema>;

export const updateBomComponentSchema = z
  .object({
    quantityPerUnit: z.number().int().positive(),
  })
  .strict();

export type UpdateBomComponentDto = z.output<typeof updateBomComponentSchema>;
