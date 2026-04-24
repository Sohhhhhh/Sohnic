import { eq, and } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { ItemSupplier } from '../types/app.types';
import { itemSuppliers } from '../../drizzle/schema';
import { IItemSuppliersRepository } from '../interfaces';
import { addItemSupplierDto } from '../dtos/suppliers/addItemSupplier.dto';
import { editItemSupplierDto } from '../dtos/suppliers/editItemSupplier.dto';

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

  async findOne(supplierId: string, itemId: string) {
    const itemSupplier = await db.query.itemSuppliers.findFirst({
      where: and(
        eq(itemSuppliers.itemId, itemId),
        eq(itemSuppliers.supplierId, supplierId),
      ),
    });

    return itemSupplier;
  }

  async editItemSupplier(supplierId: string, dto: editItemSupplierDto) {
    const { itemId, ...editDto } = dto;

    const itemSupplier = await db
      .update(itemSuppliers)
      .set({ ...editDto, price: editDto.price?.toString() })
      .where(
        and(
          eq(itemSuppliers.supplierId, supplierId),
          eq(itemSuppliers.itemId, itemId),
        ),
      )
      .returning();

    return itemSupplier[0];
  }
}
