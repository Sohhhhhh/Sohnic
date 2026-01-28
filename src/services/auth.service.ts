import bcrypt from 'bcrypt';
import { APIResponse } from '../types/api.types';
import { CreateUserDto } from '../dtos/createUser.dto';
import { generatePassword } from '../utils/generatePassword';
import UserRepository from '../repositories/users.repository';
import BranchRepository from '../repositories/branches.repository';
import { db } from '../config/drizzle';

class AuthService {
  createUser = async (dto: CreateUserDto): Promise<APIResponse> => {
    const existing = await Promise.all([
      UserRepository.getUserByUsername(dto.username),
      UserRepository.getUserByEmail(dto.email),
    ]);

    if (existing[0] || existing[1]) {
      return {
        statusCode: 409,
        status: 'CONFLICT',
        message: 'A user with this username/email already exists.',
      };
    }

    const password = generatePassword();

    // check if branchId and roleId are valid ids
    const [branch, role] = await Promise.all([
      BranchRepository.getBranchById(dto.branchId),
      UserRepository.getRoleById(dto.roleId),
    ]);

    if (!branch)
      return {
        statusCode: 404,
        status: 'NOT FOUND',
        message: 'No branch found with this id',
      };
    if (!role)
      return {
        statusCode: 404,
        status: 'NOT FOUND',
        message: 'No role found with this id',
      };

    // hash password
    const hash = await bcrypt.hash(password, 10);

    try {
      const result = await db.transaction(async (tx) => {
        const { username, email, roleId, branchId } = dto;

        const user = await UserRepository.createUser(
          username,
          email,
          roleId,
          branchId,
          hash,
          tx,
        );

        // send email with username/email and password

        return user;
      });

      return {
        statusCode: 200,
        status: 'success',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: 500,
        status: 'error',
        message: 'Failed to create user',
      };
    }
  };
}

export default new AuthService();
