import { z } from 'zod';

export const createReturnSchema = z
  .object({
    inspectionId: z.string().uuid(),
    reason: z.string().optional(),
  })
  .strict();

export type CreateReturnDto = z.output<typeof createReturnSchema>;

export type CreateReturnData = {
  type: 'supplier' | 'manufacturer' | 'transfer';
  inspectionId: string;
  quantity: number;
  inspectorId: string;
  reason?: string;
};
