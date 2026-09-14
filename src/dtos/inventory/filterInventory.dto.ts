import { z } from 'zod';

export const filterInventorySchema = z
  .object({
    warehouseId: z.string().uuid().optional(),
    itemId: z.string().uuid().optional(),
    itemType: z.enum(['raw_material', 'sellable_item']).optional(),
    lowStock: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional(),
  })
  .optional();

export type FilterInventoryDto = z.infer<typeof filterInventorySchema>;
