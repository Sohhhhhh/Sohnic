import { RolesRepository } from '../repositories/roles.repository';
import { UsersRepository } from '../repositories/users.repository';
import { BranchesRepository } from '../repositories/branches.repository';
import { SuppliersRepository } from '../repositories/suppliers.repository';
import { RefreshTokensRepository } from '../repositories/refresh-tokens.repository';
import { ItemSuppliersRepository } from '../repositories/item-suppliers.repository';
import { SetPasswordTokensRepository } from '../repositories/set-password-tokens.repository';

export const usersRepository = new UsersRepository();
export const rolesRepository = new RolesRepository();
export const branchesRepository = new BranchesRepository();
export const suppliersRepository = new SuppliersRepository();
export const refreshTokensRepository = new RefreshTokensRepository();
export const itemSuppliersRepository = new ItemSuppliersRepository();
export const setPasswordTokensRepository = new SetPasswordTokensRepository();
