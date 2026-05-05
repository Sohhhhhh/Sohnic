import { eq, and, count } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { ItemSupplier } from '../types/app.types';
import { itemSuppliers } from '../../drizzle/schema';
import { IItemSuppliersRepository, TX } from '../interfaces';
import { AddItemSupplierDto } from '../dtos/suppliers/addItemSupplier.dto';
import { EditItemSupplierDto } from '../dtos/suppliers/editItemSupplier.dto';

export class ItemSuppliersRepository implements IItemSuppliersRepository {
  async addItemSupplier(
    dto: AddItemSupplierDto,
    supplierId: string,
  ): Promise<ItemSupplier> {
    const itemSupplier = await db
      .insert(itemSuppliers)
      .values({ ...dto, supplierId, price: dto.price.toString() })
      .returning();

    return itemSupplier[0];
  }

  async findOne(supplierId: string, itemId: string) {
    const itemSupplier = await db.query.itemSuppliers.findFirst({
      where: and(
        eq(itemSuppliers.itemId, itemId),
        eq(itemSuppliers.supplierId, supplierId),
      ),
    });

    return itemSupplier;
  }

  async findOneById(id: string) {
    const itemSupplier = await db.query.itemSuppliers.findFirst({
      where: eq(itemSuppliers.id, id),
    });

    return itemSupplier;
  }

  async editItemSupplier(id: string, dto: EditItemSupplierDto) {
    const itemSupplier = await db
      .update(itemSuppliers)
      .set({ ...dto, price: dto.price?.toString() })
      .where(eq(itemSuppliers.id, id))
      .returning();

    return itemSupplier[0];
  }

  async deleteItemSupplier(id: string) {
    return await db.delete(itemSuppliers).where(eq(itemSuppliers.id, id));
  }

  async getAllItemsSuppliers(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const [itemsSuppliers, size] = await Promise.all([
      db.query.itemSuppliers.findMany({ limit, offset }),
      db.select({ count: count() }).from(itemSuppliers),
    ]);

    return { data: itemsSuppliers, size: size[0].count };
  }

  async getItemSuppliers(itemId: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const [itemsSuppliers, size] = await Promise.all([
      db.query.itemSuppliers.findMany({
        limit,
        offset,
        where: eq(itemSuppliers.itemId, itemId),
      }),
      db.select({ count: count() }).from(itemSuppliers),
    ]);

    return { data: itemsSuppliers, size: size[0].count };
  }

  async makePrimary(id: string, tx?: TX): Promise<ItemSupplier> {
    const client = tx || db;
    const itemSupplier = await client
      .update(itemSuppliers)
      .set({ isPrimary: true })
      .where(eq(itemSuppliers.id, id))
      .returning();

    return itemSupplier[0];
  }

  async removePrimary(itemId: string, tx?: TX): Promise<ItemSupplier> {
    const client = tx || db;
    const itemSupplier = await client
      .update(itemSuppliers)
      .set({ isPrimary: false })
      .where(
        and(
          eq(itemSuppliers.isPrimary, true),
          eq(itemSuppliers.itemId, itemId),
        ),
      )
      .returning();

    return itemSupplier[0];
  }

  async removePrimaryById(id: string, tx?: TX): Promise<ItemSupplier> {
    const client = tx || db;
    const itemSupplier = await client
      .update(itemSuppliers)
      .set({ isPrimary: false })
      .where(eq(itemSuppliers.id, id))
      .returning();

    return itemSupplier[0];
  }
}
