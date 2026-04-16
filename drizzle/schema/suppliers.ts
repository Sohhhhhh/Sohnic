import {
  pgTable,
  uuid,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  date,
  unique,
} from 'drizzle-orm/pg-core';

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
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const itemSuppliers = pgTable(
  'item_suppliers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    itemId: uuid('item_id').notNull(),
    supplierId: uuid('supplier_id').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    leadTimeDays: integer('lead_time_days'),
    isPrimary: boolean('is_primary').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => [unique().on(t.itemId, t.supplierId)],
);

export const supplierQuotations = pgTable('supplier_quotations', {
  id: uuid('id').defaultRandom().primaryKey(),
  purchaseRequestId: uuid('purchase_request_id').notNull(),
  supplierId: uuid('supplier_id').notNull(),
  totalPrice: numeric('total_price', { precision: 12, scale: 2 }).notNull(),
  validUntil: date('valid_until').notNull(),
  leadTimeDays: integer('lead_time_days'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const quotationItems = pgTable('quotation_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  quotationId: uuid('quotation_id').notNull(),
  itemId: uuid('item_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
});
