import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { sql } from 'drizzle-orm';
import { items } from './products';
import { branches } from './locations';
import { check } from 'drizzle-orm/pg-core';
import { purchaseOrders } from './purchasing';
import { transferRequests } from './transfers';
import { manufacturingBatches } from './manufacturing';
import { inspectionStatus, inspectionType } from './enums';

export const inspections = pgTable(
  'inspections',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orderId: uuid('order_id').references(() => purchaseOrders.id),
    manufacturingBatchId: uuid('manufacturing_batch_id').references(
      () => manufacturingBatches.id,
    ),
    transferRequestId: uuid('transfer_request_id').references(
      () => transferRequests.id,
    ),
    type: inspectionType('type').notNull(),
    inspectionDate: timestamp('inspection_date').notNull(),
    inspectionResult: inspectionStatus('inspection_result').notNull(),
    branchId: uuid('branch_id')
      .notNull()
      .references(() => branches.id, { onDelete: 'restrict' }),
    notes: text('notes'),
    defectType: varchar('defect_type', { length: 255 }),
    quantityOrdered: integer('quantity_ordered').notNull(),
    quantityReceived: integer('quantity_received').notNull(),
    quantityRejected: integer('quantity_rejected').notNull(),
    itemId: uuid('item_id')
      .notNull()
      .references(() => items.id),
    inspectorId: uuid('inspector_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },

  (table) => [
    check(
      'inspections_type_fk_chk',
      sql`
    (type='order' AND order_id IS NOT NULL AND manufacturing_batch_id IS NULL AND transfer_request_id IS NULL)
    OR (type='manufacturing_batch' AND order_id IS NULL AND manufacturing_batch_id IS NOT NULL AND transfer_request_id IS NULL)
    OR (type='transfer' AND order_id IS NULL AND manufacturing_batch_id IS NULL AND transfer_request_id IS NOT NULL)
  `,
    ),
    check(
      'inspections_qty_chk',
      sql`quantity_received >= 0 
  AND quantity_rejected >= 0 
  AND quantity_rejected <= quantity_received
  AND quantity_ordered >= quantity_received`,
    ),
    check(
      'inspections_defect_chk',
      sql`(inspection_result='passed' AND defect_type IS NULL) 
  OR (inspection_result IN ('failed','needs_rework') AND defect_type IS NOT NULL)`,
    ),
  ],
);
