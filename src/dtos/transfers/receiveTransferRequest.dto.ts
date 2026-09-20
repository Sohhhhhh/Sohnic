import { z } from 'zod';

export const receiveTransferRequestSchema = z
  .object({
    items: z
      .array(
        z.object({
          itemId: z.string().uuid(),
          quantityReceived: z.number().int().positive(),
        }),
      )
      .min(1)
      .optional(),
  })
  .strict();

export type ReceiveTransferRequestDto = z.output<
  typeof receiveTransferRequestSchema
>;
