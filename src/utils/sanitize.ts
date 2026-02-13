import { users } from '../../drizzle/schema';

export type User = typeof users.$inferSelect;
export type SafeUser = Omit<User, 'password'>;

export const sanitizeUser = (user: User): SafeUser => {
  const { password, ...safeUser } = user;
  return safeUser;
};
