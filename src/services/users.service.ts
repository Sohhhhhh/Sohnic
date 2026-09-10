import {
  IBranchesRepository,
  IRolesRepository,
  IUsersRepository,
  IUsersService,
} from '../interfaces';
import { STATUS_CODES } from '../utils/statusCodes';
import { APIResponse } from '../types/api.types';
import { AuthenticatedUser } from '../types/app.types';
import APIError from '../utils/APIError';
import { UsersBaseService } from './usersBase.service';

export class UsersService extends UsersBaseService implements IUsersService {
  constructor(
    usersRepo: IUsersRepository,
    branchesRepo: IBranchesRepository,
    rolesRepo: IRolesRepository,
  ) {
    super(usersRepo, branchesRepo, rolesRepo);
  }
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
    const foundUser = await this.checkExistingUser(userId);

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

  async updateBranch(
    userId: string,
    branchId: string,
    requestingUserId: string,
  ): Promise<APIResponse> {
    if (userId === requestingUserId)
      throw new APIError(
        'You cannot change your own branch',
        STATUS_CODES.BadRequest,
      );

    const [user] = await Promise.all([
      this.checkExistingUser(userId),
      this.checkExistingBranch(branchId),
    ]);

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

  async updateRole(
    userId: string,
    roleId: string,
    requestingUserId: string,
  ): Promise<APIResponse> {
    if (userId === requestingUserId)
      throw new APIError(
        'You cannot change your own role',
        STATUS_CODES.BadRequest,
      );

    const [user, role] = await Promise.all([
      this.checkExistingUser(userId),
      this.checkExistingRole(roleId),
    ]);
    if (role.role === 'super_admin')
      throw new APIError(
        'Cannot assign super_admin role',
        STATUS_CODES.Forbidden,
      );

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
    const user = await this.checkExistingUser(userId);
    if (user.isActive)
      throw new APIError('user is already active', STATUS_CODES.BadRequest);

    await this.usersRepo.updateIsActive(userId, true);
    return {
      statusCode: STATUS_CODES.OK,
      message: 'user activated successfully',
    };
  }

  async deactivate(
    userId: string,
    requestingUserId: string,
  ): Promise<APIResponse> {
    if (userId === requestingUserId)
      throw new APIError(
        'You cannot deactivate yourself',
        STATUS_CODES.BadRequest,
      );

    const user = await this.checkExistingUser(userId);
    if (!user.isActive)
      throw new APIError('user is already inactive', STATUS_CODES.BadRequest);

    await this.usersRepo.updateIsActive(userId, false);
    return {
      statusCode: STATUS_CODES.OK,
      message: 'user deactivated successfully',
    };
  }
}
