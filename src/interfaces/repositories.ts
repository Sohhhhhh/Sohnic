import { QueryResult } from 'pg';
import { NodePgTransaction } from 'drizzle-orm/node-postgres';

import {
  Category,
  Item,
  ItemSupplier,
  Role,
  SafeUser,
  Supplier,
  User,
  BomLine,
  PurchaseRequest,
  SupplierQuotation,
  PurchaseOrder,
} from '../types/app.types';
import {
  AddBomComponentDto,
  UpdateBomComponentDto,
} from '../dtos/items/bom.dto';
import { db } from '../config/drizzle';
import {
  CreatePurchaseOrderData,
  CreatePurchaseOrderItemData,
} from '../dtos/purchasing/createPurchaseOrder.dto';
import {
  CreatePurchaseRequestData,
  CreatePurchaseRequestItemData,
} from '../dtos/purchasing/createPurchaseRequest.dto';
import {
  CreateSupplierQuotationData,
  CreateSupplierQuotationItemData,
} from '../dtos/purchasing/createSupplierQuotation.dto';
import { CreateUserDto } from '../dtos/users/createUser.dto';
import { CreateItemDto } from '../dtos/items/createItem.dto';
import { UpdateItemDto } from '../dtos/items/updateItem.dto';
import { FilterItemsDto } from '../dtos/items/filterItems.dto';
import { CreateSupplierDto } from '../dtos/suppliers/createSupplier.dto';
import { UpdateSupplierDto } from '../dtos/suppliers/updateSupplier.dto';
import { UpdateCategoryDto } from '../dtos/categories/updateCategory.dto';
import { CreateCategoryDto } from '../dtos/categories/createCategory.dto';
import { AddItemSupplierDto } from '../dtos/suppliers/addItemSupplier.dto';
import { FilterSuppliersDto } from '../dtos/suppliers/filterSuppliers.dto';
import { EditItemSupplierDto } from '../dtos/suppliers/editItemSupplier.dto';
import { FilterItemSuppliersDto } from '../dtos/suppliers/filterItemSuppliers.dto';
import { FilterPurchaseOrdersDto } from '../dtos/purchasing/filterPurchaseOrder.dto';
import { FilterPurchaseRequestsDto } from '../dtos/purchasing/filterPurchaseRequests.dto';
import { SupplierQuotationsRepository } from '../repositories/supplier-quotations.repository';
import { UpdatePurchaseRequestStatusData } from '../dtos/purchasing/rejectPurchaseRequest.dto';

// ----- Record Types -----

export interface RefreshTokenRecord {
  token: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface SetPasswordTokenRecord {
  token: string;
  userId: string;
  expiresAt: Date;
}

export type TX = typeof db | NodePgTransaction<any, any>;

// ----- Repository Interfaces -----

export interface IUsersRepository {
  createUser(dto: CreateUserDto, tx?: any): Promise<SafeUser>;
  updateUserPassword(
    userId: string,
    password: string,
    tx?: TX,
  ): Promise<SafeUser>;
  getUserByUsername(username: string): Promise<SafeUser | undefined>;
  getUserByEmail(email: string): Promise<SafeUser | undefined>;
  getUserByPhone(phone: string): Promise<SafeUser | undefined>;
  getUserById(id: string): Promise<SafeUser | undefined>;
  getUserWithPassword(usernameOrEmail: string): Promise<User | undefined>;
  findAll(branchId?: string): Promise<SafeUser[]>;
  updateBranch(userId: string, branchId: string): Promise<SafeUser>;
  updateRole(userId: string, branchId: string): Promise<SafeUser>;
  updateIsActive(userId: string, isActive: boolean): Promise<SafeUser>;
}

export interface IRefreshTokensRepository {
  create(token: string, userId: string, tx?: TX): Promise<void>;
  getByUserAndHash(
    userId: string,
    hashedToken: string,
    tx?: TX,
  ): Promise<RefreshTokenRecord | undefined>;
  revokeByUserId(userId: string, reason?: string, tx?: TX): Promise<void>;
  revokeByHash(token: string, reason?: string, tx?: TX): Promise<void>;
}
export interface ISetPasswordTokensRepository {
  create(token: string, userId: string, tx?: TX): Promise<void>;
  getByToken(token: string, tx?: TX): Promise<SetPasswordTokenRecord | null>;
  deleteByUserId(userId: string, tx?: TX): Promise<void>;
}

export interface IRolesRepository {
  getById(id: string): Promise<Role | undefined>;
}

export interface IBranchesRepository {
  getById(id: string): Promise<Record<string, unknown> | undefined>;
}

export interface ISuppliersRepository {
  create(dto: CreateSupplierDto): Promise<Supplier>;
  getSupplierByEmail(email: string): Promise<Supplier | undefined>;
  findAll(q?: FilterSuppliersDto): Promise<Supplier[]>;
  findOne(id: string): Promise<Supplier | undefined>;
  update(id: string, dto: UpdateSupplierDto): Promise<Supplier>;
  deactivate(id: string): Promise<Supplier>;
  activate(id: string): Promise<Supplier>;
}

export interface IItemSuppliersRepository {
  addItemSupplier(
    dto: AddItemSupplierDto,
    supplierId: string,
  ): Promise<ItemSupplier>;
  findOne(
    supplierId: string,
    itemId: string,
  ): Promise<ItemSupplier | undefined>;
  findOneById(id: string): Promise<ItemSupplier | undefined>;
  editItemSupplier(id: string, dto: EditItemSupplierDto): Promise<ItemSupplier>;
  deleteItemSupplier(id: string, tx?: TX): Promise<QueryResult<never>>;
  deleteByItemId(itemId: string, tx?: TX): Promise<void>;
  getAllItemsSuppliers(
    page: number,
    limit: number,
    q?: FilterItemSuppliersDto,
  ): Promise<ItemSupplier[]>;
  getItemSuppliers(
    itemId: string,
    page: number,
    limit: number,
    q?: FilterItemSuppliersDto,
  ): Promise<ItemSupplier[]>;
  makePrimary(id: string, tx?: TX): Promise<ItemSupplier>;
  removePrimary(itemId: string, tx?: TX): Promise<ItemSupplier>;
  removePrimaryById(id: string): Promise<ItemSupplier>;
  findManyBySupplierAndItems(
    supplierId: string,
    itemIds: string[],
  ): Promise<ItemSupplier[]>;
}

export interface ICategoriesRepository {
  create(dto: CreateCategoryDto): Promise<Category>;
  findOne(id: string): Promise<Category | undefined>;
  update(id: string, dto: UpdateCategoryDto): Promise<Category>;
  delete(id: string): Promise<void>;
  getParentCategories(): Promise<Category[]>;
  getChildCategories(id: string): Promise<Category[]>;
}

export interface IItemsRepository {
  create(dto: CreateItemDto): Promise<Item>;
  findAll(page: number, limit: number, q?: FilterItemsDto): Promise<Item[]>;
  findOne(id: string): Promise<Item | undefined>;
  update(id: string, dto: UpdateItemDto): Promise<Item>;
  delete(id: string, tx?: TX): Promise<void>;
  findManyByIds(ids: string[]): Promise<Item[]>;
}

export interface IBomRepository {
  addComponent(itemId: string, dto: AddBomComponentDto): Promise<void>;
  getBomByItemId(itemId: string): Promise<BomLine[]>;
  checkIfExists(itemId: string, componentId: string): Promise<boolean>;
  updateComponent(
    itemId: string,
    componentId: string,
    dto: UpdateBomComponentDto,
  ): Promise<void>;
  removeComponent(itemId: string, componentId: string): Promise<void>;
  deleteByItemOrComponentId(id: string, tx?: TX): Promise<void>;
}

export interface IPurchaseRequestsRepository {
  createReq(dto: CreatePurchaseRequestData, tx?: TX): Promise<PurchaseRequest>;
  createManyItems(dto: CreatePurchaseRequestItemData[], tx?: TX): Promise<void>;
  getAllPurchaseRequests(
    page: number,
    limit: number,
    q?: FilterPurchaseRequestsDto,
  ): Promise<PurchaseRequest[]>;
  findReq(id: string): Promise<PurchaseRequest | undefined>;
  updateReqStatus(
    id: string,
    data: UpdatePurchaseRequestStatusData,
  ): Promise<PurchaseRequest>;
}

export interface ISupplierQuotationsRepository {
  createQuotation(
    dto: CreateSupplierQuotationData,
    tx?: TX,
  ): Promise<SupplierQuotation>;

  createManyItems(
    dto: CreateSupplierQuotationItemData[],
    tx?: TX,
  ): Promise<void>;

  getPurchReqQuotations(
    id: string,
    page: number,
    limit: number,
  ): Promise<SupplierQuotation[]>;

  getQuotation(
    id: string,
  ): Promise<Awaited<ReturnType<SupplierQuotationsRepository['getQuotation']>>>;
}

export interface IPurchaseOrdersRepository {
  createOrder(dto: CreatePurchaseOrderData, tx?: TX): Promise<PurchaseOrder>;
  createManyItems(dto: CreatePurchaseOrderItemData[], tx?: TX): Promise<void>;
  getAllOrders(
    page: number,
    limit: number,
    q?: FilterPurchaseOrdersDto,
  ): Promise<PurchaseOrder[]>;
  getOrder(id: string): Promise<PurchaseOrder | undefined>;
  getOrderByQuotationId(id: string): Promise<PurchaseOrder | undefined>;
  updateOrder(id: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder>;
}
