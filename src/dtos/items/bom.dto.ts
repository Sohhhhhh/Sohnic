import { z } from 'zod';

export const addBomComponentSchema = z.object({
  componentId: z.string().uuid(),
  quantityPerUnit: z.number().int().positive(),
});

export type AddBomComponentDto = z.output<typeof addBomComponentSchema>;

export const updateBomComponentSchema = z.object({
  quantityPerUnit: z.number().int().positive(),
});

export type UpdateBomComponentDto = z.output<typeof updateBomComponentSchema>;
