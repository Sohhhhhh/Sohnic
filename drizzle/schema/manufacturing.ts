import {
  pgTable,
  uuid,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { items } from './products';
import { manufacturingOrderStatus } from './enums';

export const manufacturers = pgTable('manufacturers', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  address: varchar('address', { length: 500 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const manufacturingOrders = pgTable('manufacturing_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id')
    .notNull()
    .references(() => items.id), // sellable item
  quantity: integer('quantity').notNull(),
  status: manufacturingOrderStatus('status').notNull().default('pending'),
  createdById: uuid('created_by_id')
    .notNull()
    .references(() => users.id),
  approvedById: uuid('approved_by_id').references(() => users.id),
  manufacturerId: uuid('manufacturer_id')
    .notNull()
    .references(() => manufacturers.id),
  approvalDate: timestamp('approval_date'),
  expectedCompletionDate: date('expected_completion_date'),
  actualCompletionDate: date('actual_completion_date'),
  totalManufacturingCost: numeric('total_manufacturing_cost', {
    precision: 12,
    scale: 2,
  }),
  notes: varchar('notes', { length: 1000 }),
  rejectionReason: varchar('rejection_reason', { length: 1000 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const manufacturingBatches = pgTable('manufacturing_batches', {
  id: uuid('id').defaultRandom().primaryKey(),
  manufacturingOrderId: uuid('manufacturing_order_id')
    .notNull()
    .references(() => manufacturingOrders.id, { onDelete: 'cascade' }),
  quantityProduced: integer('quantity_produced').notNull(),
  productionDate: date('production_date'),
  receivedById: uuid('received_by_id')
    .notNull()
    .references(() => users.id),
  notes: varchar('notes', { length: 1000 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const manufacturingOrderMaterials = pgTable(
  'manufacturing_order_materials',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    manufacturingOrderId: uuid('manufacturing_order_id')
      .notNull()
      .references(() => manufacturingOrders.id, { onDelete: 'cascade' }),
    materialId: uuid('material_id')
      .notNull()
      .references(() => items.id),
    quantity: integer('quantity').notNull(),
    unitCost: numeric('unit_cost', { precision: 10, scale: 2 }),
  },
);
