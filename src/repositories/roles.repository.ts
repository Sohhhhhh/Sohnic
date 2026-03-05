import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { roles } from '../../drizzle/schema';
import { IRolesRepository } from '../interfaces/repositories';

export class RolesRepository implements IRolesRepository {
  async getById(id: string) {
    return db.query.roles.findFirst({ where: eq(roles.id, id) });
  }
}
