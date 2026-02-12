import { z } from 'zod';

export const setPasswordSchema = z.object({
  params: z
    .object({
      encodedToken: z.string().min(1, 'Encoded token is required').base64url(),
    })
    .strict(),
  body: z
    .object({
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
    .refine((d) => d.password === d.confirmPassword, {
      message: 'Passwords do not match',
    }),
});

export type EncodedToken = z.output<typeof setPasswordSchema>['params'];
export type SetPasswordBodyDto = z.output<typeof setPasswordSchema>['body'];
