import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { inventory, warehouses, branches } from '../../drizzle/schema';
import { IInventoryRepository, TX } from '../interfaces';
import { FilterInventoryDto } from '../dtos/inventory/filterInventory.dto';
import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';

export class InventoryRepository implements IInventoryRepository {
  private async getMainWarehouseId(): Promise<string> {
    const [result] = await db
      .select({ id: warehouses.id })
      .from(warehouses)
      .innerJoin(branches, eq(warehouses.branchId, branches.id))
      .where(eq(branches.type, 'main'))
      .limit(1);

    if (!result)
      throw new APIError('Main warehouse not found.', STATUS_CODES.NotFound);

    return result.id;
  }

  async findAll(page: number, limit: number, q?: FilterInventoryDto) {
    const offset = (page - 1) * limit;

    const conditions = [
      q?.warehouseId ? eq(inventory.warehouseId, q.warehouseId) : undefined,
      q?.itemId ? eq(inventory.itemId, q.itemId) : undefined,
      q?.lowStock
        ? sql`${inventory.quantity} <= (select reorder_point from items where id = ${inventory.itemId})`
        : undefined,
    ].filter(Boolean);

    return db.query.inventory.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      with: { item: true, warehouse: true },
      limit,
      offset,
    });
  }

  async findOne(id: string) {
    return db.query.inventory.findFirst({
      where: eq(inventory.id, id),
      with: { item: true, warehouse: true },
    });
  }

  async adjust(id: string, newQuantity: number) {
    const [updated] = await db
      .update(inventory)
      .set({ quantity: newQuantity })
      .where(eq(inventory.id, id))
      .returning();
    return updated;
  }

  async findByMaterialIds(materialIds: string[]) {
    const warehouseId = await this.getMainWarehouseId();

    const result = await db
      .select()
      .from(inventory)
      .where(
        and(
          inArray(inventory.itemId, materialIds),
          eq(inventory.warehouseId, warehouseId),
        ),
      );

    return result;
  }

  async deductStockBatch(
    materials: { materialId: string; quantity: number }[],
    tx?: any,
  ) {
    const client = tx || db;
    const warehouseId = await this.getMainWarehouseId();

    await Promise.all(
      materials.map(({ materialId, quantity }) =>
        client
          .update(inventory)
          .set({ quantity: sql`${inventory.quantity} - ${quantity}` })
          .where(
            and(
              eq(inventory.itemId, materialId),
              eq(inventory.warehouseId, warehouseId),
            ),
          ),
      ),
    );
  }

  async addStock(itemId: string, quantity: number) {
    const warehouseId = await this.getMainWarehouseId();
    const [updated] = await db
      .update(inventory)
      .set({ quantity: sql`${inventory.quantity} + ${quantity}` })
      .where(
        and(
          eq(inventory.itemId, itemId),
          eq(inventory.warehouseId, warehouseId),
        ),
      )
      .returning();
    return updated;
  }

  async upsert(itemId: string, warehouseId: string, quantity: number, tx?: TX) {
    const client = tx || db;
    const [record] = await client
      .insert(inventory)
      .values({ itemId, warehouseId, quantity })
      .onConflictDoUpdate({
        target: [inventory.itemId, inventory.warehouseId],
        set: { quantity: sql`${inventory.quantity} + ${quantity}` },
      })
      .returning();
    return record;
  }
}
