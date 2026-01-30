import { users } from '../../drizzle/schema';

type User = typeof users.$inferSelect;
type SafeUser = Omit<User, 'password'>;

export const sanitizeUser = (user: User): SafeUser => {
  const { password, ...safeUser } = user;
  return safeUser;
};
