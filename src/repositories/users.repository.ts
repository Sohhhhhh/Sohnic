import { users } from '../../drizzle/schema';
import { db } from '../config/drizzle';

class UserRepository {
  async createUser(
    username: string,
    email: string,
    roleId: string,
    branchId: string,
    password: string,
  ) {
    const user = await db
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
}

export default new UserRepository();
