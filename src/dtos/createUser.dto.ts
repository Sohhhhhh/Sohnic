import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Username cannot be empty'),

    email: z
      .string()
      .min(1, 'Email cannot be empty')
      .pipe(z.string().email('Invalid email format')),

    roleId: z
      .string()
      .min(1, 'Role ID cannot be empty')
      .pipe(z.string().uuid('Role ID must be a valid UUID')),

    branchId: z
      .string()
      .min(1, 'Branch ID cannot be empty')
      .pipe(z.string().uuid('Branch ID must be a valid UUID')),
  }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>['body'];
