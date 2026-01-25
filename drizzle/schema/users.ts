import {
  pgTable,
  uuid,
  varchar,
  boolean,
  date,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';
import { userRole, refreshTokensRevocationReason } from './enums';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 255 }).unique().notNull(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  password: varchar('password', { length: 255 }),
  phone: varchar('phone', { length: 50 }).unique().notNull(),
  dateOfBirth: date('date_of_birth'),
  isActive: boolean('is_active').notNull().default(false),
  roleId: uuid('role_id').notNull(),
  branchId: uuid('branch_id').notNull(),
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
  userId: uuid('user_id').notNull(),
  token: text('token').notNull(),
  revocationReason: refreshTokensRevocationReason('revocation_reason'),
  revokedAt: timestamp('revoked_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});
