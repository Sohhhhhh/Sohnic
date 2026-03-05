import { Role, SafeUser, User } from '../utils/sanitize';
import { CreateUserDto } from '../dtos/createUser.dto';
import { db } from '../config/drizzle';
import { PostgresJsTransaction } from 'drizzle-orm/postgres-js';

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

// ----- Transaction -----

export type TransactionFn = <T>(fn: (tx: TX) => Promise<T>) => Promise<T>;
