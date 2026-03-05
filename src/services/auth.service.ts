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
import { SetPasswordBodyDto } from '../dtos/setPassword.dto';
import { ForgetPasswordDto } from '../dtos/forgetPassword.dto';
import { ChangePasswordDto } from '../dtos/changePassword.dto';
import { comparePassword, hashPassword } from '../utils/password';
import {
  IAuthService,
  IEmailService,
  IUsersRepository,
  IBranchesRepository,
  IRefreshTokensRepository,
  ISetPasswordTokensRepository,
  IRolesRepository,
} from '../interfaces';

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepo: IUsersRepository,
    private readonly setPasswordTokenRepo: ISetPasswordTokensRepository,
    private readonly refreshTokenRepo: IRefreshTokensRepository,
    private readonly roleRepo: IRolesRepository,
    private readonly emailService: IEmailService,
    private readonly branchRepo: IBranchesRepository,
  ) {}

  // --- Registration ---

  createUser = async (dto: CreateUserDto): Promise<APIResponse> => {
    await this.checkExistingUser(dto.username, dto.email, dto.phone);

    // check if branchId and roleId are valid ids
    await Promise.all([
      this.checkExistingBranch(dto.branchId),
      this.checkExistingRole(dto.roleId),
    ]);

    const { rawToken, hashedToken, encodedParam } = this.generateURLTokens();
    this.emailService
      .sendSetPasswordEmail(dto.email, encodedParam)
      .catch((error) => {
        console.error('Failed to send email:', error);
      });

    const user = await db.transaction(async (tx: any) => {
      const user = await this.userRepo.createUser(dto, tx);
      await this.setPasswordTokenRepo.create(hashedToken, user.id, tx);

      return user;
    });

    return {
      statusCode: STATUS_CODES.Created,
      message: 'A set password email has been sent to your email',
      data: { user, token: rawToken },
    };
  };

  // --- Password ---

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
      await this.setPasswordTokenRepo.getByToken(hashedToken);
    if (!storedTokenRecord)
      throw new APIError('Invalid or expired token', STATUS_CODES.BadRequest);

    // update user password and delete token
    const { userId } = storedTokenRecord;
    const hashedPassword = await hashPassword(dto.password);
    await this.refreshTokenRepo.revokeByUserId(userId, 'password_reset');

    const updatedUser = await this.userRepo.updateUserPassword(
      userId,
      hashedPassword,
    );
    this.setPasswordTokenRepo.deleteByUserId(userId).catch((error) => {
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
      ? this.userRepo.getUserByEmail(usernameOrEmail)
      : this.userRepo.getUserByUsername(usernameOrEmail));
    if (user) {
      const { hashedToken, encodedParam } = this.generateURLTokens();
      this.emailService
        .sendSetPasswordEmail(user.email, encodedParam)
        .catch((error) => {
          console.error('Failed to send email:', error);
        });
      await this.setPasswordTokenRepo.create(hashedToken, user.id);
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
    const userWithPassword = await this.userRepo.getUserWithPassword(
      user.username,
    );

    const isCorrect = await comparePassword(
      oldPassword,
      userWithPassword!.password!,
    );
    if (!isCorrect)
      throw new APIError('Old password is wrong', STATUS_CODES.BadRequest);

    const hashedPassword = await hashPassword(password);
    await this.refreshTokenRepo.revokeByUserId(user.id, 'password_change');

    const updatedUser = await this.userRepo.updateUserPassword(
      user.id,
      hashedPassword,
    );

    return {
      statusCode: STATUS_CODES.OK,
      message: 'Password changed successfully',
      data: updatedUser,
    };
  };

  // --- Login / Logout ---

  login = async (dto: loginDto): Promise<APIResponse> => {
    const { usernameOrEmail, password } = dto;
    const user = await this.userRepo.getUserWithPassword(usernameOrEmail);

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

    await this.refreshTokenRepo.revokeByUserId(
      user.id,
      'new_login_from_another_device',
    );

    const { accessToken, refreshToken, hashedRefreshToken } =
      generateAuthTokens(user);
    await this.refreshTokenRepo.create(hashedRefreshToken, user.id);

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

    await this.refreshTokenRepo.revokeByHash(hashedToken, 'logout');
    return {
      statusCode: STATUS_CODES.NoContent,
      message: 'Logged out successfully',
    };
  };

  // --- Tokens ---

  refreshToken = async (token: string): Promise<APIResponse> => {
    const verified = verifyRefreshToken(token);
    if (!verified || !verified.userId)
      throw new APIError('Invalid or expired token', STATUS_CODES.Unauthorized);

    const { userId } = verified;
    const hashedToken = await this.checkExistingRefreshToken(token, userId);

    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new APIError('User not found', STATUS_CODES.NotFound);
    if (!user.isActive)
      throw new APIError(
        'This user is no longer active. Please contact IT.',
        STATUS_CODES.Unauthorized,
      );
    await this.refreshTokenRepo.revokeByHash(hashedToken, 'rotation');

    const { accessToken, refreshToken, hashedRefreshToken } =
      generateAuthTokens(user);
    await this.refreshTokenRepo.create(hashedRefreshToken, user.id);

    return {
      statusCode: STATUS_CODES.OK,
      accessToken,
      refreshToken,
    };
  };

  // --- Helpers ---

  private async checkExistingUser(
    username: string,
    email: string,
    phone: string,
  ) {
    const [existingUsername, existingEmail, existingPhone] = await Promise.all([
      this.userRepo.getUserByUsername(username),
      this.userRepo.getUserByEmail(email),
      this.userRepo.getUserByPhone(phone),
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
    const branch = await this.branchRepo.getById(branchId);

    if (!branch)
      throw new APIError('No branch found with this id', STATUS_CODES.NotFound);
  }

  private async checkExistingRole(roleId: string) {
    const role = await this.roleRepo.getById(roleId);

    if (!role)
      throw new APIError('No role found with this id', STATUS_CODES.NotFound);
  }

  private generateURLTokens() {
    const rawToken = generateSetPasswordToken();
    const hashedToken = hashToken(rawToken);
    const encodedParam = encodeForUrl(rawToken);

    return { rawToken, hashedToken, encodedParam };
  }

  private async checkExistingRefreshToken(token: string, userId: string) {
    const hashedToken = hashToken(token);
    const tokenExists = await this.refreshTokenRepo.getByUserAndHash(
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
