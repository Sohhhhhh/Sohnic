import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { returnRequestStatus } from './enums';

export const supplierReturns = pgTable('supplier_returns', {
  id: uuid('id').defaultRandom().primaryKey(),
  supplierId: uuid('supplier_id').notNull(),
  purchaseOrderId: uuid('purchase_order_id').notNull(),
  itemId: uuid('item_id').notNull(),
  quantity: integer('quantity').notNull(),
  reason: text('reason'),
  status: returnRequestStatus('status').notNull().default('pending'),
  inspectorId: uuid('inspector_id'),
  approvedBy: uuid('approved_by'),
  inspectionId: uuid('inspection_id'),
  submissionDate: timestamp('submission_date').defaultNow(),
  reviewDate: timestamp('review_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const manufacturerReturns = pgTable('manufacturer_returns', {
  id: uuid('id').defaultRandom().primaryKey(),
  manufacturerId: uuid('manufacturer_id').notNull(),
  manufacturingOrderId: uuid('manufacturing_order_id').notNull(),
  itemId: uuid('item_id').notNull(),
  quantity: integer('quantity').notNull(),
  reason: text('reason'),
  status: returnRequestStatus('status').notNull().default('pending'),
  inspectorId: uuid('inspector_id'),
  approvedBy: uuid('approved_by'),
  inspectionId: uuid('inspection_id'),
  submissionDate: timestamp('submission_date').defaultNow(),
  reviewDate: timestamp('review_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});
