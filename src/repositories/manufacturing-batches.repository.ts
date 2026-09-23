import { eq } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { manufacturingBatches } from '../../drizzle/schema';
import { IManufacturingBatchesRepository } from '../interfaces/repositories';
import { CreateManufacturingBatchData } from '../dtos/manufacturing-batches/createManufacturingBatch.dto';
import { ManufacturingBatch } from '../types/app.types';

export class ManufacturingBatchesRepository implements IManufacturingBatchesRepository {
  async create(data: CreateManufacturingBatchData) {
    const [batch] = await db
      .insert(manufacturingBatches)
      .values({ ...data })
      .returning();

    return batch;
  }

  async findByOrder(
    orderId: string,
    page: number,
    limit: number,
  ): Promise<ManufacturingBatch[]> {
    const offset = (page - 1) * limit;

    return db.query.manufacturingBatches.findMany({
      where: eq(manufacturingBatches.manufacturingOrderId, orderId),
      limit,
      offset,
      orderBy: (manufacturingBatches, { desc }) => [
        desc(manufacturingBatches.createdAt),
      ],
    });
  }

  async findOne(id: string) {
    return db.query.manufacturingBatches.findFirst({
      where: eq(manufacturingBatches.id, id),
      with: {
        manufacturingOrder: {
          columns: { productId: true },
        },
      },
    });
  }
}
