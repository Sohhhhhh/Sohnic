import { db } from '../config/drizzle';
import { Item } from '../types/app.types';
import { items } from '../../drizzle/schema';
import { IItemsRepository } from '../interfaces';
import { CreateItemDto } from '../dtos/items/createItem.dto';

export class ItemsRepository implements IItemsRepository {
  async create(dto: CreateItemDto): Promise<Item> {
    const item = await db
      .insert(items)
      .values({ ...dto })
      .returning();

    return item[0];
  }
}
