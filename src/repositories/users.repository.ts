import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { users } from '../../drizzle/schema';
import { CreateUserDto } from '../dtos/createUser.dto';
import { sanitizeUser, User } from '../utils/sanitize';
import { IUserRepository } from '../interfaces/repositories';

export class UserRepository implements IUserRepository {
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

  async getUserById(id: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return user ? sanitizeUser(user) : undefined;
  }

  async getUserWithPassword(
    usernameOrEmail: string,
  ): Promise<User | undefined> {
    return db.query.users.findFirst({
      where: usernameOrEmail.includes('@')
        ? eq(users.email, usernameOrEmail)
        : eq(users.username, usernameOrEmail),
    });
  }
}
