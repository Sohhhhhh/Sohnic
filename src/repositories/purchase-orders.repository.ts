import { eq, getTableColumns, SQL, and, desc } from 'drizzle-orm';

import {
  purchaseOrders,
  purchaseRequests,
  purchaseOrderItems,
  supplierQuotations,
} from '../../drizzle/schema';
import { db } from '../config/drizzle';
import {
  CreatePurchaseOrderData,
  CreatePurchaseOrderItemData,
} from '../dtos/purchasing/createPurchaseOrder.dto';
import { IPurchaseOrdersRepository, TX } from '../interfaces';
import { FilterPurchaseOrdersDto } from '../dtos/purchasing/filterPurchaseOrder.dto';

export class PurchaseOrdersRepository implements IPurchaseOrdersRepository {
  async createOrder(dto: CreatePurchaseOrderData, tx?: TX) {
    const client = tx || db;

    const result = await client.insert(purchaseOrders).values(dto).returning();

    return result[0];
  }

  async createManyItems(dto: CreatePurchaseOrderItemData[], tx?: TX) {
    const client = tx || db;
    await client.insert(purchaseOrderItems).values(dto);
  }

  async getAllOrders(page: number, limit: number, q?: FilterPurchaseOrdersDto) {
    const offset = (page - 1) * limit;

    const conditions = [
      q?.status ? eq(purchaseOrders.status, q.status) : undefined,
      q?.supplierId ? eq(purchaseOrders.supplierId, q.supplierId) : undefined,
      q?.branchId ? eq(purchaseRequests.branchId, q.branchId) : undefined,
    ].filter(Boolean) as SQL[];

    return db
      .select({ ...getTableColumns(purchaseOrders) })
      .from(purchaseOrders)
      .innerJoin(
        supplierQuotations,
        eq(purchaseOrders.quotationId, supplierQuotations.id),
      )
      .innerJoin(
        purchaseRequests,
        eq(supplierQuotations.purchaseRequestId, purchaseRequests.id),
      )
      .where(conditions.length ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(purchaseOrders.createdAt));
  }

  async getOrder(id: string) {
    return db.query.purchaseOrders.findFirst({
      where: eq(purchaseOrders.id, id),
      with: {
        items: {
          columns: {
            id: false,
            orderId: false,
          },
        },
      },
    });
  }
}
