import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  integer,
  AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { branchType } from './enums';
import { users } from './users';

export const branches = pgTable('branches', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: branchType('type').default('sub').notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  managerId: uuid('manager_id').references((): AnyPgColumn => users.id),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const warehouses = pgTable('warehouses', {
  id: uuid('id').defaultRandom().primaryKey(),
  branchId: uuid('branch_id')
    .notNull()
    .references(() => branches.id, { onDelete: 'cascade' }),
  address: varchar('address', { length: 500 }).notNull(),
  capacity: integer('capacity').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});
