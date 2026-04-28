import { z } from 'zod';

export const branchIdSchema = z
  .object({
    branchId: z
      .string({ message: 'branch id must be a string' })
      .uuid({ message: 'branch id must be a valid uuid' }),
  })
  .strict();

export type BranchIdDto = z.output<typeof branchIdSchema>;
