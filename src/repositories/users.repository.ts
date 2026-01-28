import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { roles, users } from '../../drizzle/schema';

class UserRepository {
  async createUser(
    username: string,
    email: string,
    roleId: string,
    branchId: string,
    password: string,
    tx?: any,
  ) {
    const client = tx || db;

    const user = await client
      .insert(users)
      .values({
        username,
        email,
        password,
        roleId,
        branchId,
        isActive: true,
      })
      .returning();

    return user[0];
  }

  async getUserByUsername(username: string) {
    return await db.query.users.findFirst({
      where: eq(users.username, username),
    });
  }

  async getUserByEmail(email: string) {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async getRoleById(id: string) {
    const role = await db.query.roles.findFirst({ where: eq(roles.id, id) });
    return role;
  }
}

export default new UserRepository();
