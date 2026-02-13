import { CookieOptions, RequestHandler, Response } from 'express';
import { APIResponse } from '../types/api.types';
import authService from '../services/auth.service';
import { sendResponse } from '../utils/sendResponse';
import { EncodedToken } from '../dtos/setPassword.dto';
import { ForgetPasswordDto } from '../dtos/forgetPassword.dto';
import env from '../config/env';

const parseExpiresInMs = (expiresIn: string) => {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const units: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * units[unit];
};

export const createUser: RequestHandler = async (req, res, next) => {
  const result: APIResponse = await authService.createUser(req.body);
  sendResponse(res, result);
};

export const setPassword: RequestHandler<EncodedToken> = async (req, res) => {
  const result = await authService.setPassword(
    req.params.encodedToken,
    req.body,
  );
  sendResponse(res, result);
};

export const forgetPassword: RequestHandler<ForgetPasswordDto> = async (
  req,
  res,
) => {
  const result = await authService.forgetPassword(req.body);
  sendResponse(res, result);
};

export const changePassword: RequestHandler = async (req, res) => {
  const result = await authService.changePassword(req.body);
  sendResponse(res, result);
};

export const login: RequestHandler = async (req, res) => {
  const result = await authService.login(req.body);
  setRefreshTokenCookie(res, 'refreshToken', result.refreshToken!);
  delete result.refreshToken;

  sendResponse(res, result);
};

const setRefreshTokenCookie = (res: Response, name: string, token: string) => {
  const options: CookieOptions = {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production', // In production cookie will be sent only via HTTPs - encrypted
    maxAge: 7 * 24 * 60 * 60 * 100, // default max age of 7 days
  };

  if (name === 'refreshToken')
    options.maxAge = parseExpiresInMs(`${env.REFRESH_TOKEN_EXPIRES_IN_DAYS}d`);
  res.cookie(name, token, options);
};

// const clearRefreshTokenCookie = (res: Response) => {
//   res.clearCookie('refreshToken', {
//     httpOnly: true,
//     secure: env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     path: '/',
//   });
// };
