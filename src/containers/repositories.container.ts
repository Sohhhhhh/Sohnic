import { RolesRepository } from '../repositories/roles.repository';
import { UsersRepository } from '../repositories/users.repository';
import { BranchesRepository } from '../repositories/branches.repository';
import { RefreshTokensRepository } from '../repositories/refresh-tokens.repository';
import { SetPasswordTokensRepository } from '../repositories/set-password-tokens.repository';

export const usersRepository = new UsersRepository();
export const rolesRepository = new RolesRepository();
export const branchesRepository = new BranchesRepository();
export const refreshTokensRepository = new RefreshTokensRepository();
export const setPasswordTokensRepository = new SetPasswordTokensRepository();
