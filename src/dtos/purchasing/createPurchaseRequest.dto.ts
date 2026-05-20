import { z } from 'zod';

export const createPurchaseRequestSchema = z
  .object({
    branchId: z
      .string({ message: 'Branch id must be a string' })
      .uuid({ message: 'Branch id must be a valid uuid' }),
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          itemId: z.string().uuid(),
          quantityRequested: z.number().int().positive(),
          notes: z.string().optional(),
        }),
      )
      .min(1),
  })
  .strict();

export type CreatePurchaseRequestDto = z.output<
  typeof createPurchaseRequestSchema
>;

export type CreatePurchaseRequestData = Omit<
  CreatePurchaseRequestDto,
  'items'
> & {
  ordererId: string;
};

export type CreatePurchaseRequestItemData =
  CreatePurchaseRequestDto['items'][number] & {
    purchaseRequestId: string;
  };
