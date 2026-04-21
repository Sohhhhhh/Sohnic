import { db } from '../config/drizzle';
import { ItemSupplier } from '../types/app.types';
import { itemSuppliers } from '../../drizzle/schema';
import { IItemSuppliersRepository } from '../interfaces';
import { addItemSupplierDto } from '../dtos/suppliers/addItemSupplier.dto';

export class ItemSuppliersRepository implements IItemSuppliersRepository {
  async addItemSupplier(
    dto: addItemSupplierDto,
    supplierId: string,
  ): Promise<ItemSupplier> {
    const itemSupplier = await db
      .insert(itemSuppliers)
      .values({ ...dto, supplierId, price: dto.price.toString() })
      .returning();

    return itemSupplier[0];
  }
}
