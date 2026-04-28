import { z } from 'zod';

export const roleIdSchema = z
  .object({
    roleId: z
      .string({ message: 'role id must be a string' })
      .uuid({ message: 'role id must be a valid uuid' }),
  })
  .strict();

export type RoleIdDtos = z.output<typeof roleIdSchema>;
