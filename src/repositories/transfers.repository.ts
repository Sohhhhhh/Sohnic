import { and, eq, gte, lte, SQL } from 'drizzle-orm';
import { db } from '../config/drizzle';
import {
  CreateTransferRequestData,
  CreateTransferRequestItemData,
} from '../dtos/transfers/createTransferRequest.dto';
import { FilterTransferRequestsDto } from '../dtos/transfers/filterTransferRequests.dto';
import { ITransfersRepository, TX } from '../interfaces';
import { transferRequestItems, transferRequests } from '../../drizzle/schema';

export class TransfersRepository implements ITransfersRepository {
  async create(dto: CreateTransferRequestData, tx?: TX) {
    const client = tx || db;

    const result = await client
      .insert(transferRequests)
      .values(dto)
      .returning();

    return result[0];
  }

  async createManyItems(dto: CreateTransferRequestItemData[], tx?: TX) {
    const client = tx || db;
    await client.insert(transferRequestItems).values(dto);
  }

  async findAll(page: number, limit: number, q?: FilterTransferRequestsDto) {
    const offset = (page - 1) * limit;

    const conditions = [
      q?.byBranch
        ? eq(transferRequests.requestedByBranch, q.byBranch)
        : undefined,
      q?.fromBranch
        ? eq(transferRequests.requestedFromBranch, q.fromBranch)
        : undefined,
      q?.status ? eq(transferRequests.status, q.status) : undefined,
      q?.dateFrom
        ? gte(transferRequests.createdAt, new Date(q.dateFrom))
        : undefined,
      q?.dateTo
        ? lte(transferRequests.createdAt, new Date(q.dateTo))
        : undefined,
    ].filter(Boolean) as SQL[];

    return db.query.transferRequests.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      limit,
      offset,
      orderBy: (transferRequests, { desc }) => [
        desc(transferRequests.createdAt),
      ],
      with: {
        items: true,
      },
    });
  }

  async findOne(id: string) {
    return db.query.transferRequests.findFirst({
      where: eq(transferRequests.id, id),
      with: {
        items: true,
      },
    });
  }
}
