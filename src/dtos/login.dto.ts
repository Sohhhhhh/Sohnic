import { z } from 'zod';

export const loginSchema = z.object({
  body: z
    .object({
      usernameOrEmail: z.string().min(1, 'Username/email is required'),
      password: z.string().min(1, 'password is required'),
    })
    .strict(),
});

export type loginDto = z.output<typeof loginSchema>['body'];
