import { QueryResult } from 'pg';
import { PostgresJsTransaction } from 'drizzle-orm/postgres-js';

import {
  ItemSupplier,
  Role,
  SafeUser,
  Supplier,
  User,
} from '../types/app.types';
import { db } from '../config/drizzle';
import { CreateUserDto } from '../dtos/users/createUser.dto';
import { CreateSupplierDto } from '../dtos/suppliers/createSupplier.dto';
import { UpdateSupplierDto } from '../dtos/suppliers/updateSupplier.dto';
import { AddItemSupplierDto } from '../dtos/suppliers/addItemSupplier.dto';
import { EditItemSupplierDto } from '../dtos/suppliers/editItemSupplier.dto';

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

export type TX = typeof db | PostgresJsTransaction<any, any>;

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
  findAll(): Promise<Supplier[]>;
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
  deleteItemSupplier(id: string): Promise<QueryResult<never>>;
  getAllItemsSuppliers(
    page: number,
    limit: number,
  ): Promise<{ data: ItemSupplier[]; size: number }>;
  getItemSuppliers(
    itemId: string,
    page: number,
    limit: number,
  ): Promise<{ data: ItemSupplier[]; size: number }>;
  makePrimary(id: string, tx?: TX): Promise<ItemSupplier>;
  removePrimary(itemId: string, tx?: TX): Promise<ItemSupplier>;
  removePrimaryById(id: string): Promise<ItemSupplier>;
}
