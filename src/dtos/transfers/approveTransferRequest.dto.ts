import { z } from 'zod';

export const approveTransferRequestSchema = z
  .object({
    items: z
      .array(
        z.object({
          itemId: z.string().uuid(),
          quantityApproved: z.number().int().positive(),
        }),
      )
      .min(1)
      .optional(),
  })
  .strict();

export type ApproveTransferRequestDto = z.output<
  typeof approveTransferRequestSchema
>;
