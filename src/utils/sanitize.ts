import { roles, users } from '../../drizzle/schema';

export type User = typeof users.$inferSelect;
export type SafeUser = Omit<User, 'password'>;
export type Role = typeof roles.$inferSelect;
export type AuthenticatedUser = SafeUser & { role: Role };

export const sanitizeUser = (user: User): SafeUser => {
  const { password, ...safeUser } = user;
  return safeUser;
};
