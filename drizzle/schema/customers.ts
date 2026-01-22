import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  doublePrecision,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';
import { customerType, paymentMethod } from './enums';

export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  type: customerType('type').default('individual'),
  phone: varchar('phone', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  branchId: uuid('branch_id'),
  customerId: uuid('customer_id'),
  cashierId: uuid('cashier_id'),
  amount: doublePrecision('amount'),
  paymentMethod: paymentMethod('payment_method'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id'),
  itemId: uuid('item_id'),
  quantity: integer('quantity'),
  unitPrice: integer('unit_price'),
  total: integer('total'),
  isReturned: boolean('is_returned'),
  quantityReturned: integer('quantity_returned'),
  createdAt: timestamp('created_at').defaultNow(),
  returnedAt: timestamp('returned_at'),
});
