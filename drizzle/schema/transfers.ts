import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  unique,
} from 'drizzle-orm/pg-core';
import { transferRequestStatus } from './enums';
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
  createdById: uuid('created_by_id')
    .notNull()
    .references(() => users.id),
  status: transferRequestStatus('status').notNull().default('pending'),
  notes: text('notes'),
  rejectionReason: text('rejection_reason'),
  approvedById: uuid('approved_by_id').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  dispatchedById: uuid('dispatched_by_id').references(() => users.id),
  dispatchedAt: timestamp('dispatched_at'),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
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
