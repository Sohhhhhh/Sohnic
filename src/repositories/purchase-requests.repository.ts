import { db } from '../config/drizzle';
import {
  CreatePurchaseRequestData,
  CreatePurchaseRequestItemData,
} from '../dtos/purchasing/createPurchaseRequest.dto';
import { IPurchaseRequestsRepository, TX } from '../interfaces';
import { purchaseRequests, purchaseRequestItems } from '../../drizzle/schema';

export class PurchaseRequestsRepository implements IPurchaseRequestsRepository {
  async createReq(dto: CreatePurchaseRequestData, tx?: TX) {
    const client = tx || db;

    const result = await client
      .insert(purchaseRequests)
      .values(dto)
      .returning();

    return result[0];
  }

  async createManyItems(dto: CreatePurchaseRequestItemData[], tx?: TX) {
    const client = tx || db;
    await client.insert(purchaseRequestItems).values(dto);
  }
}
