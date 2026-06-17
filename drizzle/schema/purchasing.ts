import {
  pgTable,
  uuid,
  timestamp,
  text,
  date,
  numeric,
  integer,
} from 'drizzle-orm/pg-core';
import { purchaseRequestStatus, purchaseOrderStatus } from './enums';

export const purchaseRequests = pgTable('purchase_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  status: purchaseRequestStatus('status').notNull().default('pending'),
  ordererId: uuid('orderer_id').notNull(),
  reviewerId: uuid('reviewer_id'),
  branchId: uuid('branch_id').notNull(),
  reviewDate: timestamp('review_date'),
  rejectionReason: text('rejection_reason'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const purchaseRequestItems = pgTable('purchase_request_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  purchaseRequestId: uuid('purchase_request_id').notNull(),
  itemId: uuid('item_id').notNull(),
  quantityRequested: integer('quantity_requested').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const purchaseOrders = pgTable('purchase_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  quotationId: uuid('quotation_id').notNull(),
  branchId: uuid('branch_id').notNull(),
  status: purchaseOrderStatus('status').notNull().default('pending'),
  expectedDeliveryDate: date('expected_delivery_date'),
  actualDeliveryDate: date('actual_delivery_date'),
  totalPrice: numeric('total_price', { precision: 12, scale: 2 }),
  supplierId: uuid('supplier_id').notNull(),
  createdById: uuid('created_by_id').notNull(),
  approvedById: uuid('approved_by_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const purchaseOrderItems = pgTable('purchase_order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull(),
  itemId: uuid('item_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
});

export const supplierQuotations = pgTable('supplier_quotations', {
  id: uuid('id').defaultRandom().primaryKey(),
  purchaseRequestId: uuid('purchase_request_id').notNull(),
  supplierId: uuid('supplier_id').notNull(),
  validUntil: date('valid_until').notNull(),
  leadTimeDays: integer('lead_time_days').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const quotationItems = pgTable('quotation_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  quotationId: uuid('quotation_id').notNull().unique(),
  itemId: uuid('item_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
});
