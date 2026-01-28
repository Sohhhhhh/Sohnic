import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { branches } from '../../drizzle/schema';

class BranchRepository {
  async getBranchById(id: string) {
    const branch = await db.query.branches.findFirst({
      where: eq(branches.id, id),
    });
    return branch;
  }
}

export default new BranchRepository();
