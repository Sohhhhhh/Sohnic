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
  requestedByBranch: uuid('requested_by_branch').notNull(),
  requestedFromBranch: uuid('requested_from_branch').notNull(),
  status: transferRequestStatus('status').notNull().default('pending'),
  notes: text('notes'),
  approvedById: uuid('approved_by_id'),
  approvedAt: date('approved_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const transferRequestItems = pgTable('transfer_request_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemId: uuid('item_id').notNull(),
  transferRequestId: uuid('transfer_request_id').notNull(),
  quantityRequested: integer('quantity_requested').notNull(),
  quantityApproved: integer('quantity_approved'),
  quantityReceived: integer('quantity_received'),
});

export const transferOrders = pgTable('transfer_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  transferRequestId: uuid('transfer_request_id').notNull(),
  expectedDeliveryDate: date('expected_delivery_date'),
  actualDeliveryDate: date('actual_delivery_date'),
  deliveryStatus: deliveryStatus('delivery_status')
    .notNull()
    .default('in_transit'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});
