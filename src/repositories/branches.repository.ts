import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { branches } from '../../drizzle/schema';
import { IBranchRepository } from '../interfaces/repositories';

export class BranchRepository implements IBranchRepository {
  async getById(id: string) {
    return db.query.branches.findFirst({
      where: eq(branches.id, id),
    });
  }
}
