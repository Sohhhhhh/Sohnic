import {
  pgTable,
  uuid,
  date,
  text,
  varchar,
  integer,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { items } from './products';
import { branches } from './locations';
import { transferOrders } from './transfers';
import { purchaseOrders } from './purchasing';
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
    transferOrderId: uuid('transfer_order_id').references(
      () => transferOrders.id,
    ),
    type: inspectionType('type').notNull(),
    inspectionDate: date('inspection_date').notNull(),
    inspectionResult: inspectionStatus('inspection_result').notNull(),
    branchId: uuid('branch_id')
      .notNull()
      .references(() => branches.id, { onDelete: 'cascade' }),
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
  },
  (table) => [
    unique('inspections_item_order_unq').on(table.itemId, table.orderId),
    unique('inspections_item_batch_unq').on(
      table.itemId,
      table.manufacturingBatchId,
    ),
    unique('inspections_item_transfer_unq').on(
      table.itemId,
      table.transferOrderId,
    ),
  ],
);
