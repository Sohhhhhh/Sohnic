import { and, desc, eq, gte, inArray, lte, SQL } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { customers, orders, orderItems } from '../../drizzle/schema';
import { ISalesRepository, TX } from '../interfaces';
import {
  CreateSaleData,
  CreateSaleItemData,
} from '../dtos/sales/createSale.dto';
import { FilterSalesDto } from '../dtos/sales/filterSales.dto';

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
      with: { items: true, customer: true },
    });
  }

  async findAll(page: number, limit: number, q?: FilterSalesDto) {
    const offset = (page - 1) * limit;

    const conditions = [
      q?.branchId ? eq(orders.branchId, q.branchId) : undefined,
      q?.cashierId ? eq(orders.cashierId, q.cashierId) : undefined,
      q?.paymentMethod ? eq(orders.paymentMethod, q.paymentMethod) : undefined,
      q?.dateFrom
        ? gte(orders.createdAt, new Date(q.dateFrom))
        : undefined,
      q?.dateTo ? lte(orders.createdAt, new Date(q.dateTo)) : undefined,
      q?.customerType
        ? inArray(
            orders.customerId,
            db
              .select({ id: customers.id })
              .from(customers)
              .where(eq(customers.type, q.customerType)),
          )
        : undefined,
    ].filter(Boolean) as SQL[];

    return db.query.orders.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      with: { items: true, customer: true },
      limit,
      offset,
      orderBy: [desc(orders.createdAt)],
    });
  }
}
