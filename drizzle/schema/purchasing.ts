import {
  pgTable,
  uuid,
  timestamp,
  text,
  date,
  numeric,
  unique,
  integer,
} from 'drizzle-orm/pg-core';
import { purchaseRequestStatus, purchaseOrderStatus } from './enums';
import { users } from './users';
import { branches } from './locations';
import { items } from './products';
import { suppliers } from './suppliers';

export const purchaseRequests = pgTable('purchase_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  status: purchaseRequestStatus('status').notNull().default('pending'),
  ordererId: uuid('orderer_id')
    .notNull()
    .references(() => users.id),
  reviewerId: uuid('reviewer_id').references(() => users.id),
  branchId: uuid('branch_id')
    .notNull()
    .references(() => branches.id),
  reviewDate: timestamp('review_date'),
  rejectionReason: text('rejection_reason'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const purchaseRequestItems = pgTable(
  'purchase_request_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    purchaseRequestId: uuid('purchase_request_id')
      .notNull()
      .references(() => purchaseRequests.id, { onDelete: 'cascade' }),
    itemId: uuid('item_id')
      .notNull()
      .references(() => items.id),
    quantityRequested: integer('quantity_requested').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => [unique().on(t.purchaseRequestId, t.itemId)],
);

export const purchaseOrders = pgTable('purchase_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  quotationId: uuid('quotation_id')
    .notNull()
    .references(() => supplierQuotations.id),
  branchId: uuid('branch_id')
    .notNull()
    .references(() => branches.id),
  status: purchaseOrderStatus('status').notNull().default('pending'),
  expectedDeliveryDate: date('expected_delivery_date'),
  actualDeliveryDate: date('actual_delivery_date'),
  totalPrice: numeric('total_price', { precision: 12, scale: 2 }),
  supplierId: uuid('supplier_id')
    .notNull()
    .references(() => suppliers.id),
  createdById: uuid('created_by_id')
    .notNull()
    .references(() => users.id),
  approvedById: uuid('approved_by_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const purchaseOrderItems = pgTable('purchase_order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => purchaseOrders.id, { onDelete: 'cascade' }),
  itemId: uuid('item_id')
    .notNull()
    .references(() => items.id),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
});

export const supplierQuotations = pgTable('supplier_quotations', {
  id: uuid('id').defaultRandom().primaryKey(),
  purchaseRequestId: uuid('purchase_request_id')
    .notNull()
    .references(() => purchaseRequests.id, { onDelete: 'cascade' }),
  supplierId: uuid('supplier_id')
    .notNull()
    .references(() => suppliers.id),
  validUntil: date('valid_until').notNull(),
  leadTimeDays: integer('lead_time_days').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const quotationItems = pgTable(
  'quotation_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    quotationId: uuid('quotation_id')
      .notNull()
      .references(() => supplierQuotations.id, { onDelete: 'cascade' }),
    itemId: uuid('item_id')
      .notNull()
      .references(() => items.id),
    quantity: integer('quantity').notNull(),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
    notes: text('notes'),
  },
  (t) => [unique().on(t.quotationId, t.itemId)],
);
