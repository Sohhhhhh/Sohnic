import {
  pgTable,
  uuid,
  text,
  date,
  timestamp,
  integer,
  unique,
} from 'drizzle-orm/pg-core';
import { transferRequestStatus, deliveryStatus } from './enums';
import { branches } from './locations';
import { users } from './users';
import { items } from './products';

export const transferRequests = pgTable('transfer_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestedByBranch: uuid('requested_by_branch')
    .notNull()
    .references(() => branches.id),
  requestedFromBranch: uuid('requested_from_branch')
    .notNull()
    .references(() => branches.id),
  status: transferRequestStatus('status').notNull().default('pending'),
  notes: text('notes'),
  approvedById: uuid('approved_by_id').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const transferRequestItems = pgTable(
  'transfer_request_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    itemId: uuid('item_id')
      .notNull()
      .references(() => items.id),
    transferRequestId: uuid('transfer_request_id')
      .notNull()
      .references(() => transferRequests.id, { onDelete: 'cascade' }),
    quantityRequested: integer('quantity_requested').notNull(),
    quantityApproved: integer('quantity_approved'),
    quantityReceived: integer('quantity_received'),
  },
  (t) => [unique().on(t.transferRequestId, t.itemId)],
);

export const transferOrders = pgTable('transfer_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  transferRequestId: uuid('transfer_request_id')
    .notNull()
    .references(() => transferRequests.id, { onDelete: 'cascade' }),
  expectedDeliveryDate: date('expected_delivery_date'),
  actualDeliveryDate: date('actual_delivery_date'),
  deliveryStatus: deliveryStatus('delivery_status')
    .notNull()
    .default('in_transit'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});
