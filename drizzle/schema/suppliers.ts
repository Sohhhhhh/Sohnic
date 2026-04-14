import {
  pgTable,
  uuid,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  date,
  unique,
} from 'drizzle-orm/pg-core';
import { rawMaterials, sellableItems } from './products';
import { purchaseRequests } from './purchasing';

export const suppliers = pgTable('suppliers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  leadTimeDays: integer('lead_time_days'),
  isActive: boolean('is_active').default(true).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 50 }),
  country: varchar('country', { length: 255 }),
  city: varchar('city', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const rawMaterialSuppliers = pgTable(
  'raw_material_suppliers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    materialId: uuid('material_id')
      .notNull()
      .references(() => rawMaterials.id),
    supplierId: uuid('supplier_id')
      .notNull()
      .references(() => suppliers.id),
    unitPrice: decimal('unit_price').notNull(),
    leadTimeDays: integer('lead_time_days'),
    isPrimary: boolean('is_primary').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => [unique().on(t.materialId, t.supplierId)],
);

export const sellableItemSuppliers = pgTable(
  'sellable_item_suppliers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    itemId: uuid('item_id')
      .notNull()
      .references(() => sellableItems.id),
    supplierId: uuid('supplier_id')
      .notNull()
      .references(() => suppliers.id),
    purchasePrice: decimal('purchase_price').notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => [unique().on(t.itemId, t.supplierId)],
);

export const supplierQuotations = pgTable('supplier_quotations', {
  id: uuid('id').defaultRandom().primaryKey(),
  purchaseRequestId: uuid('purchase_request_id')
    .notNull()
    .references(() => purchaseRequests.id),
  supplierId: uuid('supplier_id')
    .notNull()
    .references(() => suppliers.id),
  totalPrice: decimal('total_price').notNull(),
  validUntil: date('valid_until').notNull(),
  leadTimeDays: integer('lead_time_days'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const quotationItems = pgTable('quotation_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  quotationId: uuid('quotation_id')
    .notNull()
    .references(() => supplierQuotations.id),
  itemId: uuid('item_id')
    .notNull()
    .references(() => rawMaterials.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price').notNull(),
});
