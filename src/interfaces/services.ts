import { AuthenticatedUser, SafeUser } from '../utils/sanitize';
import { loginDto } from '../dtos/login.dto';
import { APIResponse } from '../types/api.types';
import { CreateUserDto } from '../dtos/createUser.dto';
import { SetPasswordBodyDto } from '../dtos/setPassword.dto';
import { ForgetPasswordDto } from '../dtos/forgetPassword.dto';
import { ChangePasswordDto } from '../dtos/changePassword.dto';

// ----- Service Interfaces -----

export interface IAuthService {
  createUser(dto: CreateUserDto): Promise<APIResponse>;
  setPassword(
    encodedToken: string,
    dto: SetPasswordBodyDto,
  ): Promise<APIResponse>;
  forgetPassword(dto: ForgetPasswordDto): Promise<APIResponse>;
  changePassword(dto: ChangePasswordDto, user: SafeUser): Promise<APIResponse>;
  login(dto: loginDto): Promise<APIResponse>;
  logout(token: string, userId: string): Promise<APIResponse>;
  refreshToken(token: string): Promise<APIResponse>;
}

export interface IUsersService {
  findAll(user: AuthenticatedUser): Promise<APIResponse>;
  findOne(user: AuthenticatedUser, userId: string): Promise<APIResponse>;
}

// ----- Utility Interfaces -----

export interface IEmailService {
  sendSetPasswordEmail(email: string, encodedToken: string): Promise<void>;
}
