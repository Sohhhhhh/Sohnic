import { SafeUser, User } from '../types/app.types';

export const sanitizeUser = (user: User): SafeUser => {
  const { password, ...safeUser } = user;
  return safeUser;
};
