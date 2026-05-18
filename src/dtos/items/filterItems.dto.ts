import { z } from 'zod';

export const filterItemsSchema = z.object({
  type: z.enum(['raw_material', 'sellable_item']).optional(),
  name: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
});

export type FilterItemsDto = z.output<typeof filterItemsSchema>;
