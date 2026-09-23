import { and, eq, SQL } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { Return } from '../types/app.types';
import { returns } from '../../drizzle/schema';
import { IReturnsRepository } from '../interfaces/repositories';
import { CreateReturnData } from '../dtos/returns/createReturn.dto';
import { FilterReturnsDto } from '../dtos/returns/filterReturns.dto';

export class ReturnsRepository implements IReturnsRepository {
  async create(dto: CreateReturnData) {
    const [ret] = await db.insert(returns).values(dto).returning();

    return ret;
  }

  async findAll(page: number, limit: number, q?: FilterReturnsDto) {
    const offset = (page - 1) * limit;

    const conditions = [
      q?.type ? eq(returns.type, q.type) : undefined,
      q?.status ? eq(returns.status, q.status) : undefined,
      q?.inspectionId ? eq(returns.inspectionId, q.inspectionId) : undefined,
      q?.inspectorId ? eq(returns.inspectorId, q.inspectorId) : undefined,
    ].filter(Boolean) as SQL[];

    return db.query.returns.findMany({
      where: conditions.length ? and(...conditions) : undefined,

      limit,
      offset,
      orderBy: (returns, { desc }) => [desc(returns.submissionDate)],
    });
  }

  async findOne(id: string) {
    const supplierReturn = await db.query.returns.findFirst({
      where: eq(returns.id, id),
    });

    return supplierReturn;
  }

  async updateOne(id: string, data: Partial<Return>) {
    const [updated] = await db
      .update(returns)
      .set(data)
      .where(eq(returns.id, id))
      .returning();

    return updated;
  }
}
