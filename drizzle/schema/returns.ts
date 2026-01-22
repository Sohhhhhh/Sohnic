import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { returnRequestType, returnRequestStatus } from './enums';

export const returnRequests = pgTable('return_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestType: returnRequestType('request_type'),
  reason: text('reason'),
  quantity: integer('quantity'),
  status: returnRequestStatus('status').default('pending'),
  inspectorId: uuid('inspector_id'),
  approvedBy: uuid('approved_by'),
  submissionDate: timestamp('submission_date').defaultNow(),
  reviewDate: timestamp('review_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const rawMaterialReturns = pgTable('raw_material_returns', {
  id: uuid('id').defaultRandom().primaryKey(),
  returnRequestId: uuid('return_request_id').unique(),
  rawMaterialInspectionId: uuid('raw_material_inspection_id'),
  supplierId: uuid('supplier_id'),
  purchaseOrderId: uuid('purchase_order_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const finishedGoodsReturns = pgTable('finished_goods_returns', {
  id: uuid('id').defaultRandom().primaryKey(),
  returnRequestId: uuid('return_request_id').unique(),
  finishedGoodsInspectionId: uuid('finished_goods_inspection_id'),
  manufacturerId: uuid('manufacturer_id'),
  manufacturingOrderId: uuid('manufacturing_order_id'),
  createdAt: timestamp('created_at').defaultNow(),
});
