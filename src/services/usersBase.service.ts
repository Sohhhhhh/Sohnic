import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';
import {
  IUsersRepository,
  IBranchesRepository,
  IRolesRepository,
} from '../interfaces';

export class UsersBaseService {
  constructor(
    protected readonly usersRepo: IUsersRepository,
    protected readonly branchesRepo: IBranchesRepository,
    protected readonly rolesRepo: IRolesRepository,
  ) {}
  protected async checkExistingUser(id: string) {
    const existingUser = await this.usersRepo.getUserById(id);

    if (!existingUser)
      throw new APIError('no user found with this id', STATUS_CODES.NotFound);

    return existingUser;
  }

  protected async checkExistingBranch(branchId: string) {
    const branch = await this.branchesRepo.getById(branchId);
    if (!branch)
      throw new APIError('No branch found with this id', STATUS_CODES.NotFound);

    return branch;
  }

  protected async checkExistingRole(roleId: string) {
    const role = await this.rolesRepo.getById(roleId);
    if (!role)
      throw new APIError('No role found with this id', STATUS_CODES.NotFound);

    return role;
  }
}
