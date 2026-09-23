import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { branches } from '../../drizzle/schema';
import { IBranchesRepository } from '../interfaces/repositories';
import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';

export class BranchesRepository implements IBranchesRepository {
  async getById(id: string) {
    return db.query.branches.findFirst({
      where: eq(branches.id, id),
    });
  }

  async getMainBranchId(): Promise<string> {
    const [branch] = await db
      .select({ id: branches.id })
      .from(branches)
      .where(eq(branches.type, 'main'))
      .limit(1);

    if (!branch)
      throw new APIError('Main branch not found.', STATUS_CODES.NotFound);

    return branch.id;
  }
}
