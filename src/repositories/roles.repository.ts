import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { roles } from '../../drizzle/schema';
import { IRoleRepository } from '../interfaces/repositories';

export class RoleRepository implements IRoleRepository {
  async getById(id: string) {
    return db.query.roles.findFirst({ where: eq(roles.id, id) });
  }
}
