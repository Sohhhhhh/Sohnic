import { z } from 'zod';

export const AccessTokenPayloadSchema = z
  .object({
    userId: z.string().min(1, 'User ID is required'),
    username: z.string().min(1, 'Username is required'),
    email: z.string().min(1, 'Email is required'),
    roleId: z.string().min(1, 'Role id is required'),
  })
  .strict();

export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;

export const RefreshTokenPayloadSchema = z
  .object({
    userId: z.string().min(1, 'User ID is required'),
    roleId: z.string().min(1, 'Role id is required'),
  })
  .strict();

export type RefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>;
