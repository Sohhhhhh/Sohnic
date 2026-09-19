import { db } from '../config/drizzle';
import {
  CreateTransferRequestData,
  CreateTransferRequestItemData,
} from '../dtos/transfers/createTransferRequest.dto';
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
}
