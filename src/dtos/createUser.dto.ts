import { z } from 'zod';

export const createUserSchema = z.object({
  body: z
    .object({
      username: z
        .string()
        .min(1, 'Username cannot be empty')
        .refine((username) => !/[!@#$%^&*]/.test(username), {
          message: 'Username must not contain special characters',
        }),
      email: z
        .string()
        .min(1, 'Email cannot be empty')
        .pipe(z.string().email('Invalid email format')),
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      phone: z.string().min(1, 'Phone is required'),
      dateOfBirth: z.string().date('Invalid date format, Format: YYYY-MM-DD'),
      roleId: z
        .string()
        .min(1, 'Role ID cannot be empty')
        .pipe(z.string().uuid('Role ID must be a valid UUID')),
      branchId: z
        .string()
        .min(1, 'Branch ID cannot be empty')
        .pipe(z.string().uuid('Branch ID must be a valid UUID')),
    })
    .strict(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>['body'];
