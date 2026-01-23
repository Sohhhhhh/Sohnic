import {
  pgTable,
  uuid,
  date,
  text,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { inspectionStatus } from './enums';

export const rawMaterialsInspection = pgTable('raw_materials_inspection', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id'),
  inspectionDate: date('inspection_date'),
  inspectionResult: inspectionStatus('inspection_result'),
  notes: text('notes'),
  defectType: varchar('defect_type', { length: 255 }),
  quantityOrdered: integer('quantity_ordered'),
  quantityReceived: integer('quantity_received'),
  quantityRejected: integer('quantity_rejected'),
  itemId: uuid('item_id'),
  inspectorId: uuid('inspector_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const itemsInspection = pgTable('items_inspection', {
  id: uuid('id').defaultRandom().primaryKey(),
  manufacturingBatchId: uuid('manufacturing_batch_id'),
  inspectionDate: date('inspection_date'),
  inspectionResult: inspectionStatus('inspection_result'),
  notes: text('notes'),
  defectType: varchar('defect_type', { length: 255 }),
  quantityOrdered: integer('quantity_ordered'),
  quantityReceived: integer('quantity_received'),
  quantityRejected: integer('quantity_rejected'),
  itemId: uuid('item_id'),
  inspectorId: uuid('inspector_id'),
  createdAt: timestamp('created_at').defaultNow(),
});
