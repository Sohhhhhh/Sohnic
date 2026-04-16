import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';
import { customerType, paymentMethod } from './enums';

export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  type: customerType('type').default('individual').notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  branchId: uuid('branch_id').notNull(),
  customerId: uuid('customer_id').notNull(),
  cashierId: uuid('cashier_id').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: paymentMethod('payment_method').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull(),
  itemId: uuid('item_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  isReturned: boolean('is_returned').notNull().default(false),
  quantityReturned: integer('quantity_returned').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  returnedAt: timestamp('returned_at'),
});
