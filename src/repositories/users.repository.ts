import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { roles, setPasswordTokens, users } from '../../drizzle/schema';
import { CreateUserDto } from '../dtos/createUser.dto';
import { sanitizeUser } from '../utils/sanitize';

class UserRepository {
  async createUser(dto: CreateUserDto, tx?: any) {
    const client = tx || db;

    const user = await client
      .insert(users)
      .values({
        ...dto,
        isActive: true,
      })
      .returning();

    return sanitizeUser(user[0]);
  }

  async updateUserPassword(userId: string, password: string, tx?: any) {
    const client = tx || db;

    const user = await client
      .update(users)
      .set({ password, hasSetPassword: true })
      .where(eq(users.id, userId))
      .returning();

    return sanitizeUser(user[0]);
  }

  async getUserByUsername(username: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    return user ? sanitizeUser(user) : undefined;
  }

  async getUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user ? sanitizeUser(user) : undefined;
  }

  async getUserByPhone(phone: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.phone, phone),
    });

    return user ? sanitizeUser(user) : undefined;
  }

  async getRoleById(id: string) {
    const role = await db.query.roles.findFirst({ where: eq(roles.id, id) });
    return role;
  }

  async createSetPasswordToken(token: string, userId: string, tx: any) {
    const client = tx || db;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    await client.insert(setPasswordTokens).values({
      token,
      userId,
      expiresAt,
    });
  }

  async getSetPasswordToken(token: string, tx?: any) {
    const client = tx || db;
    const result = await client.query.setPasswordTokens.findFirst({
      where: eq(setPasswordTokens.token, token),
    });

    if (!result || result.expiresAt < new Date()) return null;

    return result;
  }

  async deleteSetPasswordToken(userId: string, tx?: any) {
    const client = tx || db;
    await client
      .delete(setPasswordTokens)
      .where(eq(setPasswordTokens.userId, userId));
  }
}

export default new UserRepository();
