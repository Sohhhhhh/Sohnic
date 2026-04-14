import { loginDto } from '../dtos/login.dto';
import { APIResponse } from '../types/api.types';
import { CreateUserDto } from '../dtos/createUser.dto';
import { SetPasswordBodyDto } from '../dtos/setPassword.dto';
import { ForgetPasswordDto } from '../dtos/forgetPassword.dto';
import { ChangePasswordDto } from '../dtos/changePassword.dto';
import { CreateSupplierDto } from '../dtos/createSupplier.dto';
import { AuthenticatedUser, SafeUser } from '../types/app.types';
import { UpdateSupplierDto } from '../dtos/updateSupplier.dto';

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
  updateBranch(
    userId: string,
    branchId: string,
    requestingUserId: string,
  ): Promise<APIResponse>;
  updateRole(
    userId: string,
    roleId: string,
    requestingUserId: string,
  ): Promise<APIResponse>;
  activate(userId: string): Promise<APIResponse>;
  deactivate(userId: string, requestingUserId: string): Promise<APIResponse>;
}

export interface ISuppliersService {
  create(dto: CreateSupplierDto): Promise<APIResponse>;
  findAll(): Promise<APIResponse>;
  findOne(supplierId: string): Promise<APIResponse>;
  update(supplierId: string, dto: UpdateSupplierDto): Promise<APIResponse>;
  deactivate(supplierId: string): Promise<APIResponse>;
  activate(supplierId: string): Promise<APIResponse>;
}

// ----- Utility Interfaces -----

export interface IEmailService {
  sendSetPasswordEmail(email: string, encodedToken: string): Promise<void>;
}
