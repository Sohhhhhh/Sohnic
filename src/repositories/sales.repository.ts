import { and, desc, eq, gte, inArray, lte, sql, SQL } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { customers, orders, orderItems, items } from '../../drizzle/schema';
import { ISalesRepository, TX } from '../interfaces';
import {
  CreateSaleData,
  CreateSaleItemData,
} from '../dtos/sales/createSale.dto';
import { FilterSalesDto } from '../dtos/sales/filterSales.dto';
import { sum } from 'drizzle-orm';
import { count } from 'drizzle-orm';

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
      q?.dateFrom ? gte(orders.createdAt, new Date(q.dateFrom)) : undefined,
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

  async getTotalRevenue(branchId: string, from: Date, to: Date) {
    const [revenue] = await db
      .select({ total: sum(orders.amount) })
      .from(orders)
      .where(
        and(
          eq(orders.branchId, branchId),
          gte(orders.createdAt, from),
          lte(orders.createdAt, to),
        ),
      );

    return +(revenue.total ?? 0);
  }

  // Cost of goods sold: what the items sold in this period cost us.
  // finished items -> manufacturing cost, otherwise -> purchase price.
  // NOTE: uses full sold quantity; net out `orderItems.quantityReturned`
  // here AND `orders.amount` in getTotalRevenue when returns are in use.
  async getCOGS(branchId: string, from: Date, to: Date) {
    const [cogs] = await db
      .select({
        total: sql<string>`coalesce(sum(${orderItems.quantity} * coalesce(${items.manufacturingCost}, ${items.purchasePrice}, 0)), 0)`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(items, eq(orderItems.itemId, items.id))
      .where(
        and(
          eq(orders.branchId, branchId),
          gte(orders.createdAt, from),
          lte(orders.createdAt, to),
        ),
      );

    return +cogs.total;
  }

  async getSalesByCustomerType(branchId: string, from: Date, to: Date) {
    return db
      .select({
        type: customers.type,
        total: sum(orders.amount),
        count: count(),
      })
      .from(orders)
      .innerJoin(customers, eq(orders.customerId, customers.id))
      .where(
        and(
          eq(orders.branchId, branchId),
          gte(orders.createdAt, from),
          lte(orders.createdAt, to),
        ),
      )
      .groupBy(customers.type);
  }

  async getTopItems(branchId: string, from: Date, to: Date, limit = 10) {
    const totalQty = sum(orderItems.quantity);

    return db
      .select({
        name: items.name,
        totalQty,
        totalRevenue: sql<string>`sum(${orderItems.quantity} * ${orderItems.unitPrice})`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(items, eq(orderItems.itemId, items.id))
      .where(
        and(
          eq(orders.branchId, branchId),
          gte(orders.createdAt, from),
          lte(orders.createdAt, to),
        ),
      )
      .groupBy(items.id, items.name)
      .orderBy(desc(totalQty))
      .limit(limit);
  }
}
