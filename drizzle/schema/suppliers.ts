import {
  pgTable,
  uuid,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';

export const suppliers = pgTable('suppliers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }),
  companyName: varchar('company_name', { length: 255 }),
  leadTimeDays: integer('lead_time_days'),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  country: varchar('country', { length: 255 }),
  city: varchar('city', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const rawMaterialSuppliers = pgTable('raw_material_suppliers', {
  id: uuid('id').defaultRandom().primaryKey(),
  materialId: uuid('material_id'),
  supplierId: uuid('supplier_id'),
  unitPrice: decimal('unit_price'),
  leadTimeDays: integer('lead_time_days'),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sellableItemSuppliers = pgTable('sellable_item_suppliers', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemId: uuid('item_id'),
  supplierId: uuid('supplier_id'),
  purchasePrice: decimal('purchase_price'),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const supplierQuotations = pgTable('supplier_quotations', {
  id: uuid('id').defaultRandom().primaryKey(),
  purchaseRequestId: uuid('purchase_request_id'),
  supplierId: uuid('supplier_id'),
  totalPrice: decimal('total_price'),
  validUntil: date('valid_until'),
  leadTimeDays: integer('lead_time_days'),
  createdAt: timestamp('created_at'),
});

export const quotationItems = pgTable('quotation_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  quotationId: uuid('quotation_id'),
  itemId: uuid('item_id'),
  quantity: integer('quantity'),
  unitPrice: decimal('unit_price'),
});
