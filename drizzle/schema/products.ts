import {
  pgTable,
  uuid,
  varchar,
  integer,
  numeric,
  text,
  timestamp,
  AnyPgColumn,
  unique,
} from 'drizzle-orm/pg-core';
import { itemsType, sellableItemType } from './enums';

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  parentCategoryId: uuid('parent_category_id').references(
    (): AnyPgColumn => categories.id,
    { onDelete: 'set null' },
  ),
});

export const items = pgTable('items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 255 }).unique().notNull(),
  type: itemsType('type').notNull(), // 'sellable_item' | 'raw_material'
  reorderPoint: integer('reorder_point'),
  createdAt: timestamp('created_at').defaultNow(),

  // sellable item only
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  sellableType: sellableItemType('sellable_type'), // 'finished' | 'resale'
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  manufacturingCost: numeric('manufacturing_cost', { precision: 10, scale: 2 }),
  purchasePrice: numeric('purchase_price', { precision: 10, scale: 2 }),
  modelNumber: varchar('model_number', { length: 255 }),
  description: text('description'),

  // raw material only
  unitOfMeasurement: varchar('unit_of_measurement', { length: 50 }),
  standardPrice: numeric('standard_price', { precision: 10, scale: 2 }),
});

export const billOfMaterials = pgTable(
  'bill_of_materials',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    itemId: uuid('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }), // the sellable output
    componentId: uuid('component_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }), // the raw material input
    quantityPerUnit: integer('quantity_per_unit').notNull(),
  },
  (t) => [unique().on(t.itemId, t.componentId)],
);
