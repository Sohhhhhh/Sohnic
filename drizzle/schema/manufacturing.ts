import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  integer,
  date,
  decimal,
} from 'drizzle-orm/pg-core';
import { manufacturingOrderStatus, inspectionStatus } from './enums';

export const manufacturers = pgTable('manufacturers', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: varchar('company_name', { length: 255 }),
  city: varchar('city', { length: 255 }),
  country: varchar('country', { length: 255 }),
  address: varchar('address', { length: 500 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const manufacturingOrders = pgTable('manufacturing_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id'),
  quantity: integer('quantity'),
  status: manufacturingOrderStatus('status').default('pending'),
  createdById: uuid('created_by_id'),
  approvedById: uuid('approved_by_id'),
  manufacturerId: uuid('manufacturer_id'),
  orderDate: timestamp('order_date').defaultNow(),
  approvalDate: timestamp('approval_date'),
  expectedCompletionDate: date('expected_completion_date'),
  actualCompletionDate: date('actual_completion_date'),
  totalManufacturingCost: decimal('total_manufacturing_cost'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const manufacturingBatches = pgTable('manufacturing_batches', {
  id: uuid('id').defaultRandom().primaryKey(),
  manufacturingOrderId: uuid('manufacturing_order_id'),
  qualityStatus: inspectionStatus('quality_status'),
  prodStartDate: date('prod_start_date'),
  prodCompletionDate: date('prod_completion_date'),
  quantity: integer('quantity'),
});
