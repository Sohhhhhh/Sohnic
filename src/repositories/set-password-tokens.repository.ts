import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { setPasswordTokens } from '../../drizzle/schema';
import {
  ISetPasswordTokenRepository,
  SetPasswordTokenRecord,
} from '../interfaces/repositories';

export class SetPasswordTokenRepository implements ISetPasswordTokenRepository {
  async create(token: string, userId: string, tx?: any): Promise<void> {
    await this.deleteByUserId(userId, tx);

    const client = tx || db;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await client.insert(setPasswordTokens).values({
      token,
      userId,
      expiresAt,
    });
  }

  async getByToken(
    token: string,
    tx?: any,
  ): Promise<SetPasswordTokenRecord | null> {
    const client = tx || db;
    const result = await client.query.setPasswordTokens.findFirst({
      where: eq(setPasswordTokens.token, token),
    });

    if (!result || result.expiresAt < new Date()) return null;

    return result;
  }

  async deleteByUserId(userId: string, tx?: any): Promise<void> {
    const client = tx || db;
    await client
      .delete(setPasswordTokens)
      .where(eq(setPasswordTokens.userId, userId));
  }
}
