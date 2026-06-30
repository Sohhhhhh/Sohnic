import {
  pgTable,
  uuid,
  varchar,
  boolean,
  date,
  timestamp,
  text,
  AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { userRole, refreshTokensRevocationReason } from './enums';
import { branches } from './locations';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).unique().notNull(),
  dateOfBirth: date('date_of_birth').notNull(),
  roleId: uuid('role_id')
    .notNull()
    .references(() => roles.id),
  branchId: uuid('branch_id')
    .notNull()
    .references((): AnyPgColumn => branches.id),
  password: varchar('password', { length: 255 }),
  hasSetPassword: boolean('has_set_password').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  role: userRole('role').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  revocationReason: refreshTokensRevocationReason('revocation_reason'),
  revokedAt: timestamp('revoked_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const setPasswordTokens = pgTable('set_password_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  isUsed: boolean('is_used').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});
