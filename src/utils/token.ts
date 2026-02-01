import crypto from 'crypto';

export const generateSetPasswordToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const encodeForUrl = (token: string): string => {
  return Buffer.from(`token=${token}`).toString('base64url');
};

export const decodeFromUrl = (encoded: string): string | null => {
  try {
    const decoded = Buffer.from(encoded, 'base64url').toString('utf8');
    if (!decoded.startsWith('token=')) return null;
    return decoded.substring(6);
  } catch {
    return null;
  }
};
