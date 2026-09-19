import { z } from 'zod';

export const createTransferRequestSchema = z
  .object({
    requestedByBranch: z
      .string({ message: 'Requested by branch id must be a string' })
      .uuid({ message: 'Requested by branch id must be a valid uuid' }),
    requestedFromBranch: z
      .string({ message: 'Requested from branch id must be a string' })
      .uuid({ message: 'Requested from branch id must be a valid uuid' }),
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          itemId: z.string().uuid(),
          quantityRequested: z.number().int().positive(),
        }),
      )
      .min(1),
  })
  .strict()
  .refine((data) => data.requestedByBranch !== data.requestedFromBranch, {
    message: 'Requested by branch and requested from branch must be different',
    path: ['requestedFromBranch'],
  });

export type CreateTransferRequestDto = z.output<
  typeof createTransferRequestSchema
>;

export type CreateTransferRequestData = Omit<
  CreateTransferRequestDto,
  'items'
> & {
  createdById: string;
};

export type CreateTransferRequestItemData =
  CreateTransferRequestDto['items'][number] & {
    transferRequestId: string;
  };
