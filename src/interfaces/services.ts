import {
  AddBomComponentDto,
  UpdateBomComponentDto,
} from '../dtos/items/bom.dto';
import { APIResponse } from '../types/api.types';
import { loginDto } from '../dtos/users/login.dto';
import { CreateUserDto } from '../dtos/users/createUser.dto';
import { CreateItemDto } from '../dtos/items/createItem.dto';
import { UpdateItemDto } from '../dtos/items/updateItem.dto';
import { FilterItemsDto } from '../dtos/items/filterItems.dto';
import { SetPasswordBodyDto } from '../dtos/users/setPassword.dto';
import { ForgetPasswordDto } from '../dtos/users/forgetPassword.dto';
import { ChangePasswordDto } from '../dtos/users/changePassword.dto';
import { AuthenticatedUser, Item, SafeUser } from '../types/app.types';
import { CreateSupplierDto } from '../dtos/suppliers/createSupplier.dto';
import { UpdateSupplierDto } from '../dtos/suppliers/updateSupplier.dto';
import { CreateCategoryDto } from '../dtos/categories/createCategory.dto';
import { UpdateCategoryDto } from '../dtos/categories/updateCategory.dto';
import { AddItemSupplierDto } from '../dtos/suppliers/addItemSupplier.dto';
import { FilterSuppliersDto } from '../dtos/suppliers/filterSuppliers.dto';
import { EditItemSupplierDto } from '../dtos/suppliers/editItemSupplier.dto';
import { FilterItemSuppliersDto } from '../dtos/suppliers/filterItemSuppliers.dto';
import { CreatePurchaseOrderDto } from '../dtos/purchasing/createPurchaseOrder.dto';
import { RejectPurchaseRequestDto } from '../dtos/purchasing/rejectPurchaseRequest.dto';
import { CreatePurchaseRequestDto } from '../dtos/purchasing/createPurchaseRequest.dto';
import { FilterPurchaseRequestsDto } from '../dtos/purchasing/filterPurchaseRequests.dto';
import { CreateSupplierQuotationDto } from '../dtos/purchasing/createSupplierQuotation.dto';
import { FilterPurchaseOrdersDto } from '../dtos/purchasing/filterPurchaseOrders.dto';
import { CreateInspectionDto } from '../dtos/inspections/createInspection.dto';
import { FilterInspectionsDto } from '../dtos/inspections/filterInspections.dto';
import { CreateSupplierReturnDto } from '../dtos/returns/supplier-returns/createSupplierReturn.dto';
import { FilterSupplierReturnsDto } from '../dtos/returns/supplier-returns/filterSupplierReturns.dto';

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

export interface IItemsService {
  create(dto: CreateItemDto): Promise<APIResponse>;
  findAll(
    page: number,
    limit: number,
    q?: FilterItemsDto,
  ): Promise<APIResponse>;
  findOne(id: string): Promise<APIResponse>;
  update(id: string, dto: UpdateItemDto): Promise<APIResponse>;
  delete(id: string): Promise<APIResponse>;
  checkExistingItem(id: string, type?: string): Promise<Item>;

  // BOM
  addBomComponent(
    itemId: string,
    dto: AddBomComponentDto,
  ): Promise<APIResponse>;
  getBom(itemId: string): Promise<APIResponse>;
  updateBomComponent(
    itemId: string,
    componentId: string,
    dto: UpdateBomComponentDto,
  ): Promise<APIResponse>;
  removeBomComponent(itemId: string, componentId: string): Promise<APIResponse>;
}

export interface IPurchasingService {
  // PURCH REQS
  createPurchaseRequest(
    ordererId: string,
    dto: CreatePurchaseRequestDto,
  ): Promise<APIResponse>;

  getAllPurchaseRequests(
    user: AuthenticatedUser,
    page: number,
    limit: number,
    q: FilterPurchaseRequestsDto,
  ): Promise<APIResponse>;

  getPurchaseRequest(
    user: AuthenticatedUser,
    purchaseRequestId: string,
  ): Promise<APIResponse>;

  approvePurchaseRequest(
    user: AuthenticatedUser,
    purchaseRequestId: string,
  ): Promise<APIResponse>;

  rejectPurchaseRequest(
    user: AuthenticatedUser,
    purchaseRequestId: string,
    dto: RejectPurchaseRequestDto,
  ): Promise<APIResponse>;

  // SUPPS QUOTS
  createSupplierQuotation(
    purchaseRequestId: string,
    dto: CreateSupplierQuotationDto,
  ): Promise<APIResponse>;

  getPurchReqQuotations(
    user: AuthenticatedUser,
    purchaseRequestId: string,
    page: number,
    limit: number,
  ): Promise<APIResponse>;

  getQuotation(
    user: AuthenticatedUser,
    purchaseRequestId: string,
    quotationId: string,
  ): Promise<APIResponse>;

  // PURCH ORDS
  createPurchaseOrder(
    createdById: string,
    dto: CreatePurchaseOrderDto,
  ): Promise<APIResponse>;

  getAllPurchaseOrders(
    user: AuthenticatedUser,
    page: number,
    limit: number,
    q: FilterPurchaseOrdersDto,
  ): Promise<APIResponse>;

  getPurchaseOrder(user: AuthenticatedUser, id: string): Promise<APIResponse>;
  approvePurchaseOrder(
    user: AuthenticatedUser,
    id: string,
  ): Promise<APIResponse>;
  cancelPurchaseOrder(
    user: AuthenticatedUser,
    id: string,
  ): Promise<APIResponse>;
  shipPurchaseOrder(id: string): Promise<APIResponse>;
  deliverPurchaseOrder(id: string): Promise<APIResponse>;
}

export interface IInspectionsService {
  create(inspectorId: string, dto: CreateInspectionDto): Promise<APIResponse>;
  getOne(user: AuthenticatedUser, inspectionId: string): Promise<APIResponse>;
  getAll(
    user: AuthenticatedUser,
    page: number,
    limit: number,
    q: FilterInspectionsDto,
  ): Promise<APIResponse>;
}

export interface IReturnsService {
  createSupplierReturn(dto: CreateSupplierReturnDto): Promise<APIResponse>;
  getAllSupplierReturns(
    page: number,
    limit: number,
    q?: FilterSupplierReturnsDto,
  ): Promise<APIResponse>;
  getOneSupplierReturn(id: string): Promise<APIResponse>;
  acceptSupplierReturn(userId: string, id: string): Promise<APIResponse>;
  completeSupplierReturn(id: string): Promise<APIResponse>;
}

// ----- Utility Interfaces -----

export interface IEmailService {
  sendSetPasswordEmail(email: string, encodedToken: string): Promise<void>;
}
