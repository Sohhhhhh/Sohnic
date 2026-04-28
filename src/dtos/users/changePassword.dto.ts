import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Old password is required'),
    password: z
      .string()
      .min(8, { message: 'Password must contain at least 8 characters' })
      .max(20, { message: 'Password cannot contain more than 20 characters' })
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Password must contain at least 1 upper case character',
      })
      .refine((password) => /[a-z]/.test(password), {
        message: 'Password must contain at least 1 lower case character',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Password must contain at least 1 number',
      })
      .refine((password) => /[!@#$%^&*_]/.test(password), {
        message: 'Password must contain at least 1 special character',
      }),
    confirmPassword: z.string(),
  })
  .strict()
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
  })
  .refine((d) => d.oldPassword !== d.password, {
    message: 'Old password cannot equal new password',
  });

export type ChangePasswordDto = z.output<typeof changePasswordSchema>;
