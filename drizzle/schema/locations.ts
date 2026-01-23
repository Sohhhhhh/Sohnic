import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  decimal,
} from 'drizzle-orm/pg-core';
import { branchType } from './enums';

export const branches = pgTable('branches', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }),
  type: branchType('type').default('sub'),
  city: varchar('city', { length: 255 }),
  country: varchar('country', { length: 255 }),
  managerId: uuid('manager_id'),
  isActive: boolean('is_active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const warehouses = pgTable('warehouses', {
  id: uuid('id').defaultRandom().primaryKey(),
  branchId: uuid('branch_id'),
  address: varchar('address', { length: 500 }),
  capacity: decimal('capacity'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
