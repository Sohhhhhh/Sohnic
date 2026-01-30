import { db } from '../config/drizzle';
import { APIResponse } from '../types/api.types';
import { CreateUserDto } from '../dtos/createUser.dto';
import { generateSetPasswordToken } from '../utils/token';
import UserRepository from '../repositories/users.repository';
import BranchRepository from '../repositories/branches.repository';
import { sendSetPasswordEmail } from '../utils/sendEmail';

class AuthService {
  createUser = async (dto: CreateUserDto): Promise<APIResponse> => {
    const existing = await Promise.all([
      UserRepository.getUserByUsername(dto.username),
      UserRepository.getUserByEmail(dto.email),
      UserRepository.getUserByPhone(dto.phone),
    ]);

    if (existing[0]) {
      return {
        statusCode: 409,
        status: 'CONFLICT',
        message: 'A user with this username already exists.',
      };
    }

    if (existing[1]) {
      return {
        statusCode: 409,
        status: 'CONFLICT',
        message: 'A user with this email already exists.',
      };
    }

    if (existing[2]) {
      return {
        statusCode: 409,
        status: 'CONFLICT',
        message: 'A user with this phone number already exists.',
      };
    }

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

    const setPasswordToken = generateSetPasswordToken();

    try {
      const user = await db.transaction(async (tx) => {
        const user = await UserRepository.createUser(dto, tx);
        const { token } = await UserRepository.createSetPasswordToken(
          setPasswordToken,
          user.id,
          tx,
        );

        await sendSetPasswordEmail(user.email, token);

        return user;
      });

      return {
        statusCode: 201,
        status: 'success',
        data: { user },
      };
    } catch (error) {
      console.error('Failed to create user:', error);
      return {
        statusCode: 500,
        status: 'error',
        message: 'Failed to create user',
      };
    }
  };
}

export default new AuthService();
