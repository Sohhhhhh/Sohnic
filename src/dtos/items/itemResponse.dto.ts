import z from 'zod';

// Nullable helper
const toNullable = <T extends z.ZodTypeAny>(schema: T) =>
  schema.optional().nullable();

const responseBase = z.object({
  id: z.string().uuid(),
  name: z.string(),
  sku: z.string(),
  reorderPoint: toNullable(z.number().int().positive()),
  createdAt: z.coerce.date(),
});

export const rawMaterialResponseSchema = responseBase.extend({
  type: z.literal('raw_material'),
  unitOfMeasurement: toNullable(z.string()),
  standardPrice: toNullable(z.string()),
});

export const sellableItemResponseSchema = responseBase.extend({
  type: z.literal('sellable_item'),
  categoryId: toNullable(z.string().uuid()),
  sellableType: toNullable(z.enum(['finished', 'resale'])),
  salePrice: toNullable(z.string()),
  manufacturingCost: toNullable(z.string()),
  purchasePrice: toNullable(z.string()),
  modelNumber: toNullable(z.string()),
  description: toNullable(z.string()),
});

export const itemResponseSchema = z.discriminatedUnion('type', [
  rawMaterialResponseSchema,
  sellableItemResponseSchema,
]);

export type ItemResponse = z.output<typeof itemResponseSchema>;
