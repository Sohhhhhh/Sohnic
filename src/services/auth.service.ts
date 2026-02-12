import {
  decodeFromUrl,
  encodeForUrl,
  generateSetPasswordToken,
  hashToken,
} from '../utils/token';
import { db } from '../config/drizzle';
import STATUS_CODES from '../utils/statusCodes';
import { comparePassword, hashPassword } from '../utils/password';
import { APIResponse } from '../types/api.types';
import { CreateUserDto } from '../dtos/createUser.dto';
import { sendSetPasswordEmail } from '../utils/sendEmail';
import { SetPasswordBodyDto } from '../dtos/setPassword.dto';
import UserRepository from '../repositories/users.repository';
import { ForgetPasswordDto } from '../dtos/forgetPassword.dto';
import { ChangePasswordDto } from '../dtos/changePassword.dto';
import BranchRepository from '../repositories/branches.repository';
import usersRepository from '../repositories/users.repository';

class AuthService {
  createUser = async (dto: CreateUserDto): Promise<APIResponse> => {
    const [existingUsername, existingEmail, existingPhone] = await Promise.all([
      UserRepository.getUserByUsername(dto.username),
      UserRepository.getUserByEmail(dto.email),
      UserRepository.getUserByPhone(dto.phone),
    ]);

    if (existingUsername) {
      return {
        statusCode: STATUS_CODES.Conflict,
        status: 'CONFLICT',
        message: 'A user with this username already exists.',
      };
    }

    if (existingEmail) {
      return {
        statusCode: STATUS_CODES.Conflict,
        status: 'CONFLICT',
        message: 'A user with this email already exists.',
      };
    }

    if (existingPhone) {
      return {
        statusCode: STATUS_CODES.Conflict,
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
        statusCode: STATUS_CODES.NotFound,
        status: 'NOT FOUND',
        message: 'No branch found with this id',
      };
    if (!role)
      return {
        statusCode: STATUS_CODES.NotFound,
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
        statusCode: STATUS_CODES.Created,
        status: 'success',
        message: 'A set password email has been sent to your email',
        data: { user, token: rawToken },
      };
    } catch (error) {
      console.error('Failed to create user:', error);
      return {
        statusCode: STATUS_CODES.InternalServerError,
        status: 'error',
        message: 'Failed to create user',
      };
    }
  };

  setPassword = async (
    encodedToken: string,
    dto: SetPasswordBodyDto,
  ): Promise<APIResponse> => {
    // get token from url
    const token = decodeFromUrl(encodedToken);
    if (!token)
      return {
        statusCode: STATUS_CODES.BadRequest,
        status: 'bad request',
        message: 'Invalid or expired token',
      };

    // check token in the db
    const hashedToken = hashToken(token);
    const storedTokenRecord =
      await UserRepository.getSetPasswordToken(hashedToken);
    if (!storedTokenRecord) {
      return {
        statusCode: STATUS_CODES.BadRequest,
        status: 'bad request',
        message: 'Invalid or expired token',
      };
    }

    // update user password and delete token
    const { userId } = storedTokenRecord;
    const hashedPassword = await hashPassword(dto.password);
    const updatedUser = await UserRepository.updateUserPassword(
      userId,
      hashedPassword,
    );
    UserRepository.deleteSetPasswordToken(userId).catch((error) => {
      console.error('Failed to delete token:', error);
    });

    return {
      status: 'success',
      statusCode: STATUS_CODES.OK,
      message: 'Password updated successfully',
      data: updatedUser,
    };
  };

  forgetPassword = async (dto: ForgetPasswordDto): Promise<APIResponse> => {
    const { usernameOrEmail } = dto;

    const user = await (usernameOrEmail.includes('@')
      ? UserRepository.getUserByEmail(usernameOrEmail)
      : UserRepository.getUserByUsername(usernameOrEmail));
    if (user) {
      const rawToken = generateSetPasswordToken();
      const hashedToken = hashToken(rawToken);
      const encodedParam = encodeForUrl(rawToken);
      sendSetPasswordEmail(user.email, encodedParam).catch((error) => {
        console.error('Failed to send email:', error);
      });

      await UserRepository.createSetPasswordToken(hashedToken, user.id);
    }

    return {
      status: 'success',
      statusCode: STATUS_CODES.OK,
      message: 'A set password email has been sent to your email',
    };
  };

  changePassword = async (dto: ChangePasswordDto): Promise<APIResponse> => {
    const { oldPassword, password } = dto;

    const userId = '01480a28-7828-435a-bf67-ff45b2f92828';
    const userPassword = await usersRepository.getUserPassword(userId);

    const isCorrect = await comparePassword(oldPassword, userPassword!);
    if (!isCorrect) {
      return {
        status: 'bad request',
        statusCode: STATUS_CODES.BadRequest,
        message: 'Old password is wrong',
      };
    }

    const hashedPassword = await hashPassword(password);
    const updatedUser = await usersRepository.updateUserPassword(
      userId,
      hashedPassword,
    );

    return {
      status: 'success',
      statusCode: STATUS_CODES.OK,
      message: 'Password changed successfully',
      data: updatedUser,
    };
  };
}

export default new AuthService();
