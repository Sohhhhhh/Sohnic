import {
  pgTable,
  uuid,
  date,
  text,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { inspectionStatus, inspectionType } from './enums';

export const inspections = pgTable('inspections', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id'),
  manufacturingBatchId: uuid('manufacturing_batch_id'),
  transferOrderId: uuid('transfer_order_id'),
  type: inspectionType('type').notNull(),
  inspectionDate: date('inspection_date').notNull(),
  inspectionResult: inspectionStatus('inspection_result').notNull(),
  notes: text('notes'),
  defectType: varchar('defect_type', { length: 255 }),
  quantityOrdered: integer('quantity_ordered').notNull(),
  quantityReceived: integer('quantity_received').notNull(),
  quantityRejected: integer('quantity_rejected').notNull(),
  itemId: uuid('item_id').notNull(),
  inspectorId: uuid('inspector_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
