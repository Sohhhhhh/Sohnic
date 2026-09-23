import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

import { users } from './users';
import { inspections } from './inspections';
import { returnRequestStatus, returnType } from './enums';

export const returns = pgTable('returns', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: returnType('type').notNull(),
  inspectionId: uuid('inspection_id')
    .notNull()
    .unique()
    .references(() => inspections.id),
  quantity: integer('quantity').notNull(),
  reason: text('reason'),
  status: returnRequestStatus('status').notNull().default('pending'),
  inspectorId: uuid('inspector_id')
    .notNull()
    .references(() => users.id),
  approvedById: uuid('approved_by_id').references(() => users.id),
  rejectionReason: text('rejection_reason'),
  submissionDate: timestamp('submission_date').defaultNow(),
  reviewDate: timestamp('review_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});
