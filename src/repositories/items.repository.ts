import { eq } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { Item } from '../types/app.types';
import { items } from '../../drizzle/schema';
import { IItemsRepository, TX } from '../interfaces';
import { CreateItemDto } from '../dtos/items/createItem.dto';

export class ItemsRepository implements IItemsRepository {
  async create(dto: CreateItemDto): Promise<Item> {
    const item = await db
      .insert(items)
      .values({ ...dto })
      .returning();

    return item[0];
  }

  async findOne(id: string): Promise<Item | undefined> {
    return await db.query.items.findFirst({
      where: eq(items.id, id),
    });
  }

  async delete(id: string, tx?: TX): Promise<void> {
    const client = tx || db;
    await client.delete(items).where(eq(items.id, id));
  }
}
