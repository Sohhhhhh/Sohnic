import {
  IBranchesRepository,
  IRolesRepository,
  IUsersRepository,
  IUsersService,
} from '../interfaces';
import STATUS_CODES from '../utils/statusCodes';
import { APIResponse } from '../types/api.types';
import { AuthenticatedUser } from '../utils/sanitize';
import APIError from '../utils/APIError';

export class UsersService implements IUsersService {
  constructor(
    private readonly usersRepo: IUsersRepository,
    private readonly branchesRepo: IBranchesRepository,
    private readonly rolesRepo: IRolesRepository,
  ) {}
  async findAll(user: AuthenticatedUser): Promise<APIResponse> {
    const branchId =
      user.role.role === 'branch_admin' ? user.branchId : undefined;
    const users = await this.usersRepo.findAll(branchId);

    return {
      statusCode: STATUS_CODES.OK,
      size: users.length,
      data: users,
    };
  }

  async findOne(user: AuthenticatedUser, userId: string): Promise<APIResponse> {
    const foundUser = await this.usersRepo.getUserById(userId);
    if (!foundUser)
      throw new APIError('No user found with this id', STATUS_CODES.NotFound);

    if (
      user.role.role === 'branch_admin' &&
      foundUser.branchId !== user.branchId
    )
      throw new APIError(
        'No user in your branch found with this id',
        STATUS_CODES.NotFound,
      );

    return {
      statusCode: STATUS_CODES.OK,
      data: foundUser,
    };
  }

  async updateBranch(userId: string, branchId: string): Promise<APIResponse> {
    const [user, branch] = await Promise.all([
      this.usersRepo.getUserById(userId),
      this.branchesRepo.getById(branchId),
    ]);

    if (!user)
      throw new APIError('No user found with this id', STATUS_CODES.NotFound);
    if (!branch)
      throw new APIError('No branch found with this id', STATUS_CODES.NotFound);
    if (user.branchId === branchId)
      throw new APIError(
        'the user is already in this branch',
        STATUS_CODES.BadRequest,
      );

    await this.usersRepo.updateBranch(userId, branchId);

    return {
      statusCode: STATUS_CODES.OK,
      message: "user's branch updated successfully.",
    };
  }

  async updateRole(userId: string, roleId: string): Promise<APIResponse> {
    const [user, role] = await Promise.all([
      this.usersRepo.getUserById(userId),
      this.rolesRepo.getById(roleId),
    ]);

    if (!user)
      throw new APIError('No user found with this id', STATUS_CODES.NotFound);
    if (!role)
      throw new APIError('No role found with this id', STATUS_CODES.NotFound);
    if (user.roleId === roleId)
      throw new APIError(
        'the user is already in this role',
        STATUS_CODES.BadRequest,
      );

    await this.usersRepo.updateRole(userId, roleId);

    return {
      statusCode: STATUS_CODES.OK,
      message: "user's role updated successfully.",
    };
  }

  async activate(userId: string): Promise<APIResponse> {
    const user = await this.usersRepo.getUserById(userId);
    if (!user)
      throw new APIError('No user found with this id', STATUS_CODES.NotFound);
    if (user.isActive)
      throw new APIError('user is already active', STATUS_CODES.NotFound);

    await this.usersRepo.updateIsActive(userId, true);
    return {
      statusCode: STATUS_CODES.OK,
      message: 'user activated successfully',
    };
  }

  async deactivate(userId: string): Promise<APIResponse> {
    const user = await this.usersRepo.getUserById(userId);
    if (!user)
      throw new APIError('No user found with this id', STATUS_CODES.NotFound);
    if (!user.isActive)
      throw new APIError('user is already inactive', STATUS_CODES.NotFound);

    await this.usersRepo.updateIsActive(userId, false);
    return {
      statusCode: STATUS_CODES.OK,
      message: 'user deactivated successfully',
    };
  }
}
