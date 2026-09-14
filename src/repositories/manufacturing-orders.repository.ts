import { and, eq, gte, lte, SQL } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { manufacturingOrders } from '../../drizzle/schema';
import { IManufacturingOrdersRepository } from '../interfaces';
import { CreateManufacturingOrderData } from '../dtos/manufacturing-orders/createManufacturingOrder.dto';
import { FilterManufacturingOrdersDto } from '../dtos/manufacturing-orders/filterManufacturingOrder.dto';
import { ManufacturingOrder } from '../types/app.types';

export class ManufacturingOrdersRepository implements IManufacturingOrdersRepository {
  async create(data: CreateManufacturingOrderData) {
    const order = await db
      .insert(manufacturingOrders)
      .values({ ...data })
      .returning();

    return order[0];
  }

  async findAll(page: number, limit: number, q?: FilterManufacturingOrdersDto) {
    const offset = (page - 1) * limit;

    const conditions = [
      q?.status ? eq(manufacturingOrders.status, q.status) : undefined,
      q?.manufacturerId
        ? eq(manufacturingOrders.manufacturerId, q.manufacturerId)
        : undefined,
      q?.productId ? eq(manufacturingOrders.productId, q.productId) : undefined,
      q?.createdById
        ? eq(manufacturingOrders.createdById, q.createdById)
        : undefined,
      q?.dateFrom
        ? gte(manufacturingOrders.createdAt, new Date(q.dateFrom))
        : undefined,
      q?.dateTo
        ? lte(manufacturingOrders.createdAt, new Date(q.dateTo))
        : undefined,
    ].filter((c): c is SQL => c !== undefined) as SQL[];

    return db.query.manufacturingOrders.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      limit,
      offset,
      orderBy: (manufacturingOrders, { desc }) => [
        desc(manufacturingOrders.createdAt),
      ],
    });
  }

  async findOne(id: string) {
    return db.query.manufacturingOrders.findFirst({
      where: eq(manufacturingOrders.id, id),
    });
  }

  async updateOrder(id: string, data: Partial<ManufacturingOrder>) {
    const [order] = await db
      .update(manufacturingOrders)
      .set(data)
      .where(eq(manufacturingOrders.id, id))
      .returning();
    return order;
  }
}
