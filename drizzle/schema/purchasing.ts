import {
  pgTable,
  uuid,
  timestamp,
  text,
  date,
  doublePrecision,
  integer,
} from 'drizzle-orm/pg-core';
import { purchaseRequestStatus, purchaseOrderStatus } from './enums';

export const purchaseRequests = pgTable('purchase_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  status: purchaseRequestStatus('status').default('pending'),
  ordererId: uuid('orderer_id'),
  reviewerId: uuid('reviewer_id'),
  branchId: uuid('branch_id'),
  requestDate: timestamp('request_date').defaultNow(),
  reviewDate: timestamp('review_date'),
  rejectionReason: text('rejection_reason'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const purchaseRequestItems = pgTable('purchase_request_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  purchaseRequestId: uuid('purchase_request_id'),
  materialId: uuid('material_id'),
  quantityRequested: integer('quantity_requested'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const purchaseOrders = pgTable('purchase_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  quotationId: uuid('quotation_id'),
  status: purchaseOrderStatus('status').default('pending'),
  orderDate: date('order_date'),
  expectedDeliveryDate: date('expected_delivery_date'),
  actualDeliveryDate: date('actual_delivery_date'),
  totalPrice: doublePrecision('total_price'),
  supplierId: uuid('supplier_id'),
  createdById: uuid('created_by_id'),
  approvedById: uuid('approved_by_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const purchaseOrderItems = pgTable('purchase_order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id'),
  itemId: uuid('item_id'),
  quantity: integer('quantity'),
  unitPrice: doublePrecision('unit_price'),
  total: doublePrecision('total'),
});
