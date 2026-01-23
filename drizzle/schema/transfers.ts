import {
  pgTable,
  uuid,
  text,
  date,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { transferRequestStatus, deliveryStatus } from './enums';

export const transferRequests = pgTable('transfer_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestedByBranch: uuid('requested_by_branch'),
  requestedFromBranch: uuid('requested_from_branch'),
  status: transferRequestStatus('status').default('pending'),
  notes: text('notes'),
  approvedById: uuid('approved_by_id'),
  approvedAt: date('approved_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const transferRequestItems = pgTable('transfer_request_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemId: uuid('item_id'),
  transferRequestId: uuid('transfer_request_id'),
  quantityRequested: integer('quantity_requested'),
  quantityApproved: integer('quantity_approved'),
  quantityReceived: integer('quantity_received'),
});

export const transferOrders = pgTable('transfer_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  transferRequestId: uuid('transfer_request_id'),
  expectedDeliveryDate: date('expected_delivery_date'),
  actualDeliveryDate: date('actual_delivery_date'),
  deliveryStatus: deliveryStatus('delivery_status'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});
