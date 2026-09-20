import { z } from 'zod';

export const rejectTransferRequestSchema = z.object({
  rejectionReason: z.string().min(1),
});

export type RejectTransferRequestDto = z.output<
  typeof rejectTransferRequestSchema
>;
