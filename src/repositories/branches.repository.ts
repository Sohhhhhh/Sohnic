import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { branches } from '../../drizzle/schema';
import { IBranchesRepository } from '../interfaces/repositories';

export class BranchesRepository implements IBranchesRepository {
  async getById(id: string) {
    return db.query.branches.findFirst({
      where: eq(branches.id, id),
    });
  }
}
