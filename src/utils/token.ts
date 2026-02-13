import crypto from 'crypto';
import env from '../config/env';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AccessTokenPayload, RefreshTokenPayload } from '../dtos/token.dto';

const generateJWT = <T extends object>(
  data: T,
  secret: string,
  expiresIn: string,
): string => {
  return jwt.sign(data, secret, {
    expiresIn: expiresIn,
  } as object);
};

export const generateAccessToken = (data: AccessTokenPayload): string => {
  return generateJWT(
    data,
    env.ACCESS_TOKEN_SECRET,
    `${env.ACCESS_TOKEN_EXPIRES_IN_MINUTES}m`,
  );
};

export const generateRefreshToken = (data: RefreshTokenPayload): string => {
  return generateJWT(
    data,
    env.REFRESH_TOKEN_SECRET,
    `${env.REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
  );
};

const verifyJWT = <T>(
  token: string,
  secret: string,
): (T & JwtPayload) | false => {
  try {
    return jwt.verify(token, secret) as T & JwtPayload;
  } catch {
    return false;
  }
};

export const verifyAccessToken = (token: string) => {
  return verifyJWT<AccessTokenPayload>(token, env.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return verifyJWT<RefreshTokenPayload>(token, env.REFRESH_TOKEN_SECRET);
};

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
