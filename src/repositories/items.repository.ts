import { and, eq, ilike } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { Item } from '../types/app.types';
import { items } from '../../drizzle/schema';
import { IItemsRepository, TX } from '../interfaces';
import { CreateItemDto } from '../dtos/items/createItem.dto';
import { UpdateItemDto } from '../dtos/items/updateItem.dto';
import { FilterItemsDto } from '../dtos/items/filterItems.dto';

export class ItemsRepository implements IItemsRepository {
  async create(dto: CreateItemDto): Promise<Item> {
    const item = await db
      .insert(items)
      .values({ ...dto })
      .returning();

    return item[0];
  }

  async findAll(
    page: number,
    limit: number,
    q?: FilterItemsDto,
  ): Promise<Item[]> {
    const offset = (page - 1) * limit;

    const conditions = [
      q?.type ? eq(items.type, q.type) : undefined,
      q?.name ? ilike(items.name, `%${q.name}%`) : undefined,
      q?.sku ? ilike(items.sku, `%${q.sku}%`) : undefined,
    ].filter(Boolean) as any[];

    return db.query.items.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      limit,
      offset,
      orderBy: (items, { desc }) => [desc(items.createdAt)],
    });
  }

  async findOne(id: string): Promise<Item | undefined> {
    return await db.query.items.findFirst({
      where: eq(items.id, id),
    });
  }

  async update(id: string, dto: UpdateItemDto): Promise<Item> {
    const updated = await db
      .update(items)
      .set(dto)
      .where(eq(items.id, id))
      .returning();

    return updated[0];
  }

  async delete(id: string, tx?: TX): Promise<void> {
    const client = tx || db;
    await client.delete(items).where(eq(items.id, id));
  }
}
