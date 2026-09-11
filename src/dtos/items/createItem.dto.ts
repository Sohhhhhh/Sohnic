import { z } from 'zod';

export const baseItemSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  reorderPoint: z.number().int().positive().optional(),
});

export const rawMaterialSchema = baseItemSchema.extend({
  type: z.literal('raw_material'),
  unitOfMeasurement: z.string().min(1),
  standardPrice: z
    .number()
    .positive()
    .transform((val) => String(val))
    .optional(),
});

export const sellableItemSchema = baseItemSchema.extend({
  type: z.literal('sellable_item'),
  categoryId: z.string().uuid().optional(),
  sellableType: z.enum(['finished', 'resale']),
  salePrice: z
    .number()
    .positive()
    .transform((val) => String(val)),
  manufacturingCost: z
    .number()
    .positive()
    .transform((val) => String(val))
    .optional(),
  purchasePrice: z
    .number()
    .positive()
    .transform((val) => String(val))
    .optional(),
  modelNumber: z.string().optional(),
  description: z.string().optional(),
});

export const createItemSchema = z.discriminatedUnion('type', [
  rawMaterialSchema.strict(),
  sellableItemSchema.strict(),
]);

export type CreateItemDto = z.output<typeof createItemSchema>;
