import {
  hashToken,
  encodeForUrl,
  decodeFromUrl,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  generateSetPasswordToken,
} from '../utils/token';
import { db } from '../config/drizzle';
import { loginDto } from '../dtos/login.dto';
import STATUS_CODES from '../utils/statusCodes';
import { sanitizeUser } from '../utils/sanitize';
import { APIResponse } from '../types/api.types';
import { CreateUserDto } from '../dtos/createUser.dto';
import { sendSetPasswordEmail } from '../utils/sendEmail';
import { SetPasswordBodyDto } from '../dtos/setPassword.dto';
import UserRepository from '../repositories/users.repository';
import { ForgetPasswordDto } from '../dtos/forgetPassword.dto';
import { ChangePasswordDto } from '../dtos/changePassword.dto';
import { comparePassword, hashPassword } from '../utils/password';
import BranchRepository from '../repositories/branches.repository';
import { AccessTokenPayload, RefreshTokenPayload } from '../dtos/token.dto';
import APIError from '../utils/APIError';

class AuthService {
  createUser = async (dto: CreateUserDto): Promise<APIResponse> => {
    const [existingUsername, existingEmail, existingPhone] = await Promise.all([
      UserRepository.getUserByUsername(dto.username),
      UserRepository.getUserByEmail(dto.email),
      UserRepository.getUserByPhone(dto.phone),
    ]);

    if (existingUsername)
      throw new APIError(
        'A user with this username already exists.',
        STATUS_CODES.Conflict,
      );

    if (existingEmail)
      throw new APIError(
        'A user with this email already exists.',
        STATUS_CODES.Conflict,
      );

    if (existingPhone)
      throw new APIError(
        'A user with this phone number already exists.',
        STATUS_CODES.Conflict,
      );

    // check if branchId and roleId are valid ids
    const [branch, role] = await Promise.all([
      BranchRepository.getBranchById(dto.branchId),
      UserRepository.getRoleById(dto.roleId),
    ]);

    if (!branch)
      throw new APIError('No branch found with this id', STATUS_CODES.NotFound);

    if (!role)
      throw new APIError('No role found with this id', STATUS_CODES.NotFound);

    const rawToken = generateSetPasswordToken();
    const hashedToken = hashToken(rawToken);
    const encodedParam = encodeForUrl(rawToken);

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
      message: 'A set password email has been sent to your email',
      data: { user, token: rawToken },
    };
  };

  setPassword = async (
    encodedToken: string,
    dto: SetPasswordBodyDto,
  ): Promise<APIResponse> => {
    // get token from url
    const token = decodeFromUrl(encodedToken);
    if (!token)
      throw new APIError('Invalid or expired token', STATUS_CODES.BadRequest);

    // check token in the db
    const hashedToken = hashToken(token);
    const storedTokenRecord =
      await UserRepository.getSetPasswordToken(hashedToken);
    if (!storedTokenRecord)
      throw new APIError('Invalid or expired token', STATUS_CODES.BadRequest);

    // update user password and delete token
    const { userId } = storedTokenRecord;
    const hashedPassword = await hashPassword(dto.password);
    await UserRepository.revokeRefreshByUserId(userId, 'password_reset');

    const updatedUser = await UserRepository.updateUserPassword(
      userId,
      hashedPassword,
    );
    UserRepository.deleteSetPasswordToken(userId).catch((error) => {
      console.error('Failed to delete token:', error);
    });

    return {
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
      statusCode: STATUS_CODES.OK,
      message: 'A set password email has been sent to your email',
    };
  };

  changePassword = async (dto: ChangePasswordDto): Promise<APIResponse> => {
    const { oldPassword, password } = dto;

    const username = 'soh';

    const user = await UserRepository.getUnsanitizedUser(username);
    const userId = '01480a28-7828-435a-bf67-ff45b2f92828';

    if (!user!.password)
      throw new APIError(
        'Complete your setup to login',
        STATUS_CODES.BadRequest,
      );

    const isCorrect = await comparePassword(oldPassword, user!.password!);
    if (!isCorrect)
      throw new APIError('Old password is wrong', STATUS_CODES.BadRequest);

    const hashedPassword = await hashPassword(password);
    await UserRepository.revokeRefreshByUserId(userId, 'password_change');

    const updatedUser = await UserRepository.updateUserPassword(
      userId,
      hashedPassword,
    );

    return {
      statusCode: STATUS_CODES.OK,
      message: 'Password changed successfully',
      data: updatedUser,
    };
  };

  login = async (dto: loginDto): Promise<APIResponse> => {
    const { usernameOrEmail, password } = dto;
    const user = await UserRepository.getUnsanitizedUser(usernameOrEmail);

    if (!user)
      throw new APIError(
        'Wrong username/email or password',
        STATUS_CODES.NotFound,
      );

    if (!user.hasSetPassword)
      throw new APIError(
        'Complete your setup to login',
        STATUS_CODES.BadRequest,
      );

    const isCorrectPass = await comparePassword(password, user.password!);
    if (!isCorrectPass)
      throw new APIError(
        'Wrong username/email or password',
        STATUS_CODES.NotFound,
      );

    await UserRepository.revokeRefreshByUserId(
      user.id,
      'new_login_from_another_device',
    );

    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
    };
    const refreshTokenPayload: RefreshTokenPayload = {
      userId: user.id,
      roleId: user.roleId,
    };

    const accessToken = generateAccessToken(accessTokenPayload);
    const refreshToken = generateRefreshToken(refreshTokenPayload);
    const hashedRefreshToken = hashToken(refreshToken);
    await UserRepository.createRefreshToken(hashedRefreshToken, user.id);

    return {
      statusCode: STATUS_CODES.OK,
      message: 'Logged in successfully',
      data: {
        user: sanitizeUser(user),
      },
      accessToken,
      refreshToken,
    };
  };

  logout = async (token: string): Promise<APIResponse> => {
    const verified = verifyRefreshToken(token);

    if (!verified)
      throw new APIError('Invalid or expired token', STATUS_CODES.BadRequest);

    const { userId } = verified;
    const hashedToken = hashToken(token);

    const tokenExists = await UserRepository.getRefreshToken(
      userId,
      hashedToken,
    );

    if (!tokenExists)
      throw new APIError('Invalid or expired token', STATUS_CODES.BadRequest);

    await UserRepository.revokeRefreshByUserId(userId, 'logout');
    return {
      statusCode: STATUS_CODES.NoContent,
      message: 'Logged out successfully',
    };
  };

  // refreshToken = async (token: string): Promise<APIResponse> => {
  //   const verified = verifyRefreshToken(token);

  //   if (!verified) {
  //     return {
  //       status: 'bad request',
  //       statusCode: STATUS_CODES.BadRequest,
  //       message: 'Invalid or expired token',
  //     };
  //   }
  // };
}

export default new AuthService();
