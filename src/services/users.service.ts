import { IUsersRepository, IUsersService } from '../interfaces';
import STATUS_CODES from '../utils/statusCodes';
import { APIResponse } from '../types/api.types';
import { AuthenticatedUser } from '../utils/sanitize';

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
}
