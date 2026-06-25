import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

import { users } from './users';
import { items } from './products';
import { inspections } from './inspections';
import { transferOrders } from './transfers';
import { purchaseOrders } from './purchasing';
import { returnRequestStatus } from './enums';
import { manufacturers, manufacturingOrders } from './manufacturing';
import { suppliers } from './suppliers';

export const supplierReturns = pgTable('supplier_returns', {
  id: uuid('id').defaultRandom().primaryKey(),
  supplierId: uuid('supplier_id')
    .notNull()
    .references(() => suppliers.id),
  purchaseOrderId: uuid('purchase_order_id')
    .notNull()
    .references(() => purchaseOrders.id),
  itemId: uuid('item_id')
    .notNull()
    .references(() => items.id),
  quantity: integer('quantity').notNull(),
  reason: text('reason'),
  status: returnRequestStatus('status').notNull().default('pending'),
  inspectorId: uuid('inspector_id').references(() => users.id),
  approvedById: uuid('approved_by_id').references(() => users.id),
  inspectionId: uuid('inspection_id')
    .notNull()
    .references(() => inspections.id),
  submissionDate: timestamp('submission_date').defaultNow(),
  reviewDate: timestamp('review_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const manufacturerReturns = pgTable('manufacturer_returns', {
  id: uuid('id').defaultRandom().primaryKey(),
  manufacturerId: uuid('manufacturer_id')
    .notNull()
    .references(() => manufacturers.id),
  manufacturingOrderId: uuid('manufacturing_order_id')
    .notNull()
    .references(() => manufacturingOrders.id),
  itemId: uuid('item_id')
    .notNull()
    .references(() => items.id),
  quantity: integer('quantity').notNull(),
  reason: text('reason'),
  status: returnRequestStatus('status').notNull().default('pending'),
  inspectorId: uuid('inspector_id').references(() => users.id),
  approvedById: uuid('approved_by_id').references(() => users.id),
  inspectionId: uuid('inspection_id')
    .notNull()
    .references(() => inspections.id),
  submissionDate: timestamp('submission_date').defaultNow(),
  reviewDate: timestamp('review_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const transferReturns = pgTable('transfer_returns', {
  id: uuid('id').defaultRandom().primaryKey(),
  transferOrderId: uuid('transfer_order_id')
    .notNull()
    .references(() => transferOrders.id),
  itemId: uuid('item_id')
    .notNull()
    .references(() => items.id),
  quantity: integer('quantity').notNull(),
  reason: text('reason'),
  status: returnRequestStatus('status').notNull().default('pending'),
  inspectorId: uuid('inspector_id').references(() => users.id),
  approvedById: uuid('approved_by_id').references(() => users.id),
  inspectionId: uuid('inspection_id')
    .notNull()
    .references(() => inspections.id),
  submissionDate: timestamp('submission_date').defaultNow(),
  reviewDate: timestamp('review_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});
