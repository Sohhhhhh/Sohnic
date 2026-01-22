import { pgTable, uuid, integer, date, timestamp } from 'drizzle-orm/pg-core';

export const rawMaterialsInventory = pgTable('raw_materials_inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  rawMaterialId: uuid('raw_material_id'),
  warehouseId: uuid('warehouse_id'),
  quantity: integer('quantity').default(0),
  lastStocktakeDate: date('last_stocktake_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sellableItemsInventory = pgTable('sellable_items_inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  sellableItemId: uuid('sellable_item_id'),
  warehouseId: uuid('warehouse_id'),
  quantity: integer('quantity').default(0),
  lastStocktakeDate: date('last_stocktake_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
