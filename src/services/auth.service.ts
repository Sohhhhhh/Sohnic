import {
  encodeForUrl,
  generateSetPasswordToken,
  hashToken,
} from '../utils/token';
import { db } from '../config/drizzle';
import { APIResponse } from '../types/api.types';
import { CreateUserDto } from '../dtos/createUser.dto';
import { sendSetPasswordEmail } from '../utils/sendEmail';
import UserRepository from '../repositories/users.repository';
import BranchRepository from '../repositories/branches.repository';

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

    const rawToken = generateSetPasswordToken();
    const hashedToken = hashToken(rawToken);
    const encodedParam = encodeForUrl(rawToken);

    try {
      const user = await db.transaction(async (tx) => {
        const user = await UserRepository.createUser(dto, tx);
        await UserRepository.createSetPasswordToken(hashedToken, user.id, tx);

        return user;
      });

      sendSetPasswordEmail(user.email, encodedParam).catch((error) => {
        console.error('Failed to send email:', error);
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
