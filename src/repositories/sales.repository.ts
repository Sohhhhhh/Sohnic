import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { orders, orderItems } from '../../drizzle/schema';
import { ISalesRepository, TX } from '../interfaces';
import {
  CreateSaleData,
  CreateSaleItemData,
} from '../dtos/sales/createSale.dto';

export class SalesRepository implements ISalesRepository {
  async createSale(data: CreateSaleData, tx?: TX) {
    const client = tx || db;
    const [sale] = await client.insert(orders).values(data).returning();
    return sale;
  }

  async createSaleItems(items: CreateSaleItemData[], tx?: TX) {
    const client = tx || db;
    return client.insert(orderItems).values(items).returning();
  }

  async findSaleWithItems(id: string) {
    return db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: { items: true },
    });
  }
}
