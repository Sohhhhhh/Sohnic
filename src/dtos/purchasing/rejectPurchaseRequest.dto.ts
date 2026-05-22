import { z } from 'zod';

export const rejectPurchaseRequestSchema = z.object({
  rejectionReason: z.string().min(1),
});

export type RejectPurchaseRequestDto = z.output<
  typeof rejectPurchaseRequestSchema
>;

export type UpdatePurchaseRequestStatusData = {
  status: 'approved' | 'rejected';
  reviewerId: string;
  reviewDate: Date;
  rejectionReason?: string;
};
