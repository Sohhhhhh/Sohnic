import {
  hashToken,
  encodeForUrl,
  decodeFromUrl,
  generateSetPasswordToken,
  verifyRefreshToken,
  generateAuthTokens,
} from '../utils/token';
import { db } from '../config/drizzle';
import APIError from '../utils/APIError';
import { loginDto } from '../dtos/login.dto';
import STATUS_CODES from '../utils/statusCodes';
import { SafeUser, sanitizeUser } from '../utils/sanitize';
import { APIResponse } from '../types/api.types';
import { CreateUserDto } from '../dtos/createUser.dto';
import { sendSetPasswordEmail } from '../utils/sendEmail';
import { SetPasswordBodyDto } from '../dtos/setPassword.dto';
import UserRepository from '../repositories/users.repository';
import { ForgetPasswordDto } from '../dtos/forgetPassword.dto';
import { ChangePasswordDto } from '../dtos/changePassword.dto';
import { comparePassword, hashPassword } from '../utils/password';
import BranchRepository from '../repositories/branches.repository';

class AuthService {
  createUser = async (dto: CreateUserDto): Promise<APIResponse> => {
    await this.checkExistingUser(dto.username, dto.email, dto.phone);

    // check if branchId and roleId are valid ids
    await Promise.all([
      this.checkExistingBranch(dto.branchId),
      this.checkExistingRole(dto.roleId),
    ]);

    const { rawToken, hashedToken } = this.generateURLTokens(dto.email);

    const user = await db.transaction(async (tx) => {
      const user = await UserRepository.createUser(dto, tx);
      await UserRepository.createSetPasswordToken(hashedToken, user.id, tx);

      return user;
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
      const { hashedToken } = this.generateURLTokens(user.email);
      await UserRepository.createSetPasswordToken(hashedToken, user.id);
    }

    return {
      statusCode: STATUS_CODES.OK,
      message: 'A set password email has been sent to your email',
    };
  };

  changePassword = async (
    dto: ChangePasswordDto,
    user: SafeUser,
  ): Promise<APIResponse> => {
    const { oldPassword, password } = dto;
    const unsanitizedUser = await UserRepository.getUnsanitizedUser(
      user.username,
    );

    const isCorrect = await comparePassword(
      oldPassword,
      unsanitizedUser!.password!,
    );
    if (!isCorrect)
      throw new APIError('Old password is wrong', STATUS_CODES.BadRequest);

    const hashedPassword = await hashPassword(password);
    await UserRepository.revokeRefreshByUserId(user.id, 'password_change');

    const updatedUser = await UserRepository.updateUserPassword(
      user.id,
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

    const { accessToken, refreshToken } = await generateAuthTokens(user);

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

  logout = async (token: string, userId: string): Promise<APIResponse> => {
    const hashedToken = await this.checkExistingRefreshToken(token, userId);

    await UserRepository.revokeRefreshByHash(hashedToken, 'logout');
    return {
      statusCode: STATUS_CODES.NoContent,
      message: 'Logged out successfully',
    };
  };

  refreshToken = async (token: string): Promise<APIResponse> => {
    const verified = verifyRefreshToken(token);
    if (!verified || !verified.userId)
      throw new APIError('Invalid or expired token', STATUS_CODES.Unauthorized);

    const { userId } = verified;
    const hashedToken = await this.checkExistingRefreshToken(token, userId);

    const user = await UserRepository.getUserById(userId);
    if (!user) throw new APIError('User not found', STATUS_CODES.NotFound);
    if (!user.isActive)
      throw new APIError(
        'This user is no longer active. Please contact IT.',
        STATUS_CODES.Unauthorized,
      );
    await UserRepository.revokeRefreshByHash(hashedToken, 'rotation');

    const { accessToken, refreshToken } = await generateAuthTokens(user);

    return {
      statusCode: STATUS_CODES.OK,
      accessToken,
      refreshToken,
    };
  };

  // ----- Helpers -------

  private async checkExistingUser(
    username: string,
    email: string,
    phone: string,
  ) {
    const [existingUsername, existingEmail, existingPhone] = await Promise.all([
      UserRepository.getUserByUsername(username),
      UserRepository.getUserByEmail(email),
      UserRepository.getUserByPhone(phone),
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
  }

  private async checkExistingBranch(branchId: string) {
    const branch = await BranchRepository.getBranchById(branchId);

    if (!branch)
      throw new APIError('No branch found with this id', STATUS_CODES.NotFound);
  }

  private async checkExistingRole(roleId: string) {
    const role = await UserRepository.getRoleById(roleId);

    if (!role)
      throw new APIError('No role found with this id', STATUS_CODES.NotFound);
  }

  private generateURLTokens(email: string) {
    const rawToken = generateSetPasswordToken();
    const hashedToken = hashToken(rawToken);
    const encodedParam = encodeForUrl(rawToken);

    sendSetPasswordEmail(email, encodedParam).catch((error) => {
      console.error('Failed to send email:', error);
    });

    return { rawToken, hashedToken };
  }

  private async checkExistingRefreshToken(token: string, userId: string) {
    const hashedToken = hashToken(token);
    const tokenExists = await UserRepository.getRefreshToken(
      userId,
      hashedToken,
    );

    if (
      !tokenExists ||
      tokenExists.revokedAt ||
      tokenExists.expiresAt < new Date()
    )
      throw new APIError('Invalid or expired token', STATUS_CODES.BadRequest);
    return hashedToken;
  }
}

export default new AuthService();
