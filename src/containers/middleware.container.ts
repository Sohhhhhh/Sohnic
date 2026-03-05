import { createAuthMiddleware } from '../middlewares/isAuthenticated';
import { rolesRepository, usersRepository } from './repositories.container';

export const isAuthenticated = createAuthMiddleware(
  usersRepository,
  rolesRepository,
);
