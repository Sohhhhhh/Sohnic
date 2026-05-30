import { db } from '../config/drizzle';
import {
  CreatePurchaseOrderData,
  CreatePurchaseOrderItemData,
} from '../dtos/purchasing/createPurchaseOrder.dto';
import { IPurchaseOrdersRepository, TX } from '../interfaces';
import { purchaseOrders, purchaseOrderItems } from '../../drizzle/schema';

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
}
