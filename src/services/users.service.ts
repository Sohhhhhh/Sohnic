import { IUsersRepository, IUsersService } from '../interfaces';
import STATUS_CODES from '../utils/statusCodes';
import { APIResponse } from '../types/api.types';
import { AuthenticatedUser } from '../utils/sanitize';
import APIError from '../utils/APIError';

export class UsersService implements IUsersService {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async findAll(user: AuthenticatedUser): Promise<APIResponse> {
    const branchId =
      user.role.role === 'branch_admin' ? user.branchId : undefined;
    const users = await this.usersRepository.findAll(branchId);

    return {
      statusCode: STATUS_CODES.OK,
      size: users.length,
      data: users,
    };
  }

  async findOne(user: AuthenticatedUser, userId: string): Promise<APIResponse> {
    const foundUser = await this.usersRepository.getUserById(userId);
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
}
