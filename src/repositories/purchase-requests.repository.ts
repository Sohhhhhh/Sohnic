import { db } from '../config/drizzle';
import {
  CreatePurchaseRequestData,
  CreatePurchaseRequestItemData,
} from '../dtos/purchasing/createPurchaseRequest.dto';
import { IPurchaseRequestsRepository, TX } from '../interfaces';
import { purchaseRequests, purchaseRequestItems } from '../../drizzle/schema';
import { FilterPurchaseRequestsDto } from '../dtos/purchasing/filterPurchaseRequests.dto';
import { and, eq, SQL } from 'drizzle-orm';
import { UpdatePurchaseRequestStatusData } from '../dtos/purchasing/rejectPurchaseRequest.dto';

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

  async getAllPurchaseRequests(
    page: number,
    limit: number,
    q?: FilterPurchaseRequestsDto,
  ) {
    const offset = (page - 1) * limit;

    const conditions = [
      q?.branchId ? eq(purchaseRequests.branchId, q.branchId) : undefined,
      q?.status ? eq(purchaseRequests.status, q.status) : undefined,
    ].filter(Boolean) as SQL[];

    return db.query.purchaseRequests.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      limit,
      offset,
      orderBy: (purchaseRequests, { desc }) => [
        desc(purchaseRequests.createdAt),
      ],
      with: {
        items: true,
      },
    });
  }

  async findReq(id: string) {
    return db.query.purchaseRequests.findFirst({
      where: eq(purchaseRequests.id, id),
      with: {
        items: {
          columns: {
            id: false,
            purchaseRequestId: false,
            createdAt: false,
          },
        },
      },
    });
  }

  async updateReqStatus(id: string, data: UpdatePurchaseRequestStatusData) {
    const result = await db
      .update(purchaseRequests)
      .set(data)
      .where(eq(purchaseRequests.id, id))
      .returning();

    return result[0];
  }
}
