import z from 'zod';
import { rawMaterialSchema, sellableItemSchema } from './createItem.dto';

const responseBase = { id: z.string().uuid(), createdAt: z.coerce.date() };

const toNullable = <T extends z.ZodTypeAny>(schema: T) =>
  schema.optional().nullable();

export const rawMaterialResponseSchema = rawMaterialSchema
  .extend(responseBase)
  .extend({
    reorderPoint: toNullable(z.number().int().positive()),
    standardPrice: toNullable(z.string()),
  });

export const sellableItemResponseSchema = sellableItemSchema
  .extend(responseBase)
  .extend({
    reorderPoint: toNullable(z.number().int().positive()),
    categoryId: toNullable(z.string().uuid()),
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
