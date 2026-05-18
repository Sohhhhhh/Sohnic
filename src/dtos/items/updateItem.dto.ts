import { z } from 'zod';
import { rawMaterialSchema, sellableItemSchema } from './createItem.dto';

export const updateRawMaterialSchema = rawMaterialSchema
  .omit({ type: true, sku: true })
  .partial();

export const updateSellableItemSchema = sellableItemSchema
  .omit({ type: true, sku: true, modelNumber: true, sellableType: true })
  .partial();

export const updateItemSchema = updateRawMaterialSchema
  .merge(updateSellableItemSchema)
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type UpdateItemDto = z.output<typeof updateItemSchema>;
