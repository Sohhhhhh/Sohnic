import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { users } from '../../drizzle/schema';
import { sanitizeUser } from '../utils/sanitize';
import { SafeUser, User } from '../types/app.types';
import { CreateUserDto } from '../dtos/createUser.dto';
import { IUsersRepository } from '../interfaces/repositories';

export class UsersRepository implements IUsersRepository {
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

  async findAll(branchId?: string): Promise<SafeUser[]> {
    return db.query.users.findMany({
      where: branchId ? eq(users.branchId, branchId) : undefined,
      columns: {
        password: false,
      },
    });
  }

  async updateBranch(userId: string, branchId: string): Promise<SafeUser> {
    const user = await db
      .update(users)
      .set({ branchId })
      .where(eq(users.id, userId))
      .returning();

    return user[0];
  }

  async updateRole(userId: string, roleId: string): Promise<SafeUser> {
    const user = await db
      .update(users)
      .set({ roleId })
      .where(eq(users.id, userId))
      .returning();

    return user[0];
  }

  async updateIsActive(userId: string, isActive: boolean): Promise<SafeUser> {
    const user = await db
      .update(users)
      .set({ isActive })
      .where(eq(users.id, userId))
      .returning();

    return user[0];
  }
}
