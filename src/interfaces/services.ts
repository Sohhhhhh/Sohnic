import { APIResponse } from '../types/api.types';
import { loginDto } from '../dtos/users/login.dto';
import { CreateUserDto } from '../dtos/users/createUser.dto';
import { CreateCategoryDto } from '../dtos/categories/createCategory.dto';
import { AuthenticatedUser, SafeUser } from '../types/app.types';
import { SetPasswordBodyDto } from '../dtos/users/setPassword.dto';
import { ForgetPasswordDto } from '../dtos/users/forgetPassword.dto';
import { ChangePasswordDto } from '../dtos/users/changePassword.dto';
import { CreateSupplierDto } from '../dtos/suppliers/createSupplier.dto';
import { UpdateSupplierDto } from '../dtos/suppliers/updateSupplier.dto';
import { AddItemSupplierDto } from '../dtos/suppliers/addItemSupplier.dto';
import { FilterSuppliersDto } from '../dtos/suppliers/filterSuppliers.dto';
import { EditItemSupplierDto } from '../dtos/suppliers/editItemSupplier.dto';
import { FilterItemSuppliersDto } from '../dtos/suppliers/filterItemSuppliers.dto';
import { UpdateCategoryDto } from '../dtos/categories/updateCategory.dto';

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
  findAll(q?: FilterSuppliersDto): Promise<APIResponse>;
  findOne(supplierId: string): Promise<APIResponse>;
  update(supplierId: string, dto: UpdateSupplierDto): Promise<APIResponse>;
  deactivate(supplierId: string): Promise<APIResponse>;
  activate(supplierId: string): Promise<APIResponse>;

  addItemSupplier(
    dto: AddItemSupplierDto,
    supplierId: string,
  ): Promise<APIResponse>;
  editItemSupplier(dto: EditItemSupplierDto, id: string): Promise<APIResponse>;
  deleteItemSupplier(id: string): Promise<APIResponse>;
  getAllItemsSuppliers(
    page: number,
    limit: number,
    q?: FilterItemSuppliersDto,
  ): Promise<APIResponse>;
  getItemSuppliers(
    itemId: string,
    page: number,
    limit: number,
    q?: FilterItemSuppliersDto,
  ): Promise<APIResponse>;
  makePrimary(id: string): Promise<APIResponse>;
  removePrimary(id: string): Promise<APIResponse>;
}

export interface ICategoriesService {
  create(dto: CreateCategoryDto): Promise<APIResponse>;
  update(id: string, dto: UpdateCategoryDto): Promise<APIResponse>;
  delete(id: string): Promise<APIResponse>;
  getParentCategories(): Promise<APIResponse>;
  getChildCategories(id: string): Promise<APIResponse>;
}

// ----- Utility Interfaces -----

export interface IEmailService {
  sendSetPasswordEmail(email: string, encodedToken: string): Promise<void>;
}
