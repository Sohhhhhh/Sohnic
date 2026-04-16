import {
  pgTable,
  uuid,
  integer,
  date,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

export const inventory = pgTable(
  'inventory',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    itemId: uuid('item_id').notNull(),
    warehouseId: uuid('warehouse_id').notNull(),
    quantity: integer('quantity').default(0).notNull(),
    lastStocktakeDate: date('last_stocktake_date'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.itemId, table.warehouseId)],
);
