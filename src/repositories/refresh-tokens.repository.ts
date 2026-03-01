import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { refreshTokens } from '../../drizzle/schema';
import {
  IRefreshTokenRepository,
  RefreshTokenRecord,
} from '../interfaces/repositories';

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(token: string, userId: string, tx?: any): Promise<void> {
    const client = tx || db;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await client.insert(refreshTokens).values({
      token,
      userId,
      expiresAt,
    });
  }

  async getByUserAndHash(
    userId: string,
    hashedToken: string,
    tx?: any,
  ): Promise<RefreshTokenRecord | undefined> {
    const client = tx || db;
    return client.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.userId, userId),
        eq(refreshTokens.token, hashedToken),
      ),
    });
  }

  async revokeByUserId(
    userId: string,
    reason?: string,
    tx?: any,
  ): Promise<void> {
    const client = tx || db;
    await client
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
        revocationReason: reason ?? 'logout',
      })
      .where(
        and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)),
      );
  }

  async revokeByHash(token: string, reason?: string, tx?: any): Promise<void> {
    const client = tx || db;
    await client
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
        revocationReason: reason || 'logout',
      })
      .where(eq(refreshTokens.token, token));
  }
}
