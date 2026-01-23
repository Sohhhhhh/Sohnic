import {
  pgTable,
  uuid,
  varchar,
  integer,
  doublePrecision,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { sellableItemType } from './enums';

export const sellableItems = pgTable('sellable_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }),
  sku: varchar('sku', { length: 255 }).unique(),
  categoryId: uuid('category_id'),
  type: sellableItemType('type'),
  salePrice: doublePrecision('sale_price'),
  reorderPoint: integer('reorder_point'),
  description: text('description'),
  manufacturingCost: doublePrecision('manufacturing_cost'), // For type='finished'
  purchasePrice: doublePrecision('purchase_price'), // For type='resale'
  modelNumber: varchar('model_number', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const rawMaterials = pgTable('raw_materials', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }),
  sku: varchar('sku', { length: 255 }).unique(),
  unitOfMeasurement: varchar('unit_of_measurement', { length: 50 }),
  reorderPoint: integer('reorder_point'),
  standardPrice: doublePrecision('standard_price'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }),
  parentCategoryId: uuid('parent_category_id'),
});

export const billOfMaterials = pgTable('bill_of_materials', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemId: uuid('item_id'),
  rawMaterialId: uuid('raw_material_id'),
  quantityPerUnit: integer('quantity_per_unit'),
});
