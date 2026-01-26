import { APIResponse } from '../types/api.types';
import { CreateUserDto } from '../dtos/createUser.dto';
import UserRepository from '../repositories/users.repository';
import { generatePassword } from '../utils/generatePassword';

class AuthService {
  createUser = (dto: CreateUserDto): APIResponse => {
    const password = generatePassword();
    // send email with username/email and password

    const { username, email, roleId, branchId } = dto;
    const user = UserRepository.createUser(
      username,
      email,
      roleId,
      branchId,
      password,
    );
    const result: APIResponse = {
      statusCode: 200,
      status: 'success',
      data: user,
    };
    return result;
  };
}

export default new AuthService();
