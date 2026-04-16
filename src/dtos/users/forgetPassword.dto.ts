import { z } from 'zod';

export const forgetPasswordSchema = z.object({
  body: z
    .object({
      usernameOrEmail: z.string().min(1, 'Username/email is required'),
    })
    .strict(),
});

export type ForgetPasswordDto = z.output<typeof forgetPasswordSchema>['body'];
