import { CookieOptions, RequestHandler, Response } from 'express';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { EncodedToken } from '../dtos/setPassword.dto';
import { ForgetPasswordDto } from '../dtos/forgetPassword.dto';
import { IAuthService } from '../interfaces/services';
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

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  createUser: RequestHandler = async (req, res) => {
    const result: APIResponse = await this.authService.createUser(req.body);
    sendResponse(res, result);
  };

  setPassword: RequestHandler<EncodedToken> = async (req, res) => {
    const result = await this.authService.setPassword(
      req.params.encodedToken,
      req.body,
    );
    sendResponse(res, result);
  };

  forgetPassword: RequestHandler<ForgetPasswordDto> = async (req, res) => {
    const result = await this.authService.forgetPassword(req.body);
    sendResponse(res, result);
  };

  changePassword: RequestHandler = async (req, res) => {
    const { role, ...user } = req.user!;
    const result = await this.authService.changePassword(req.body, user);
    sendResponse(res, result);
  };

  login: RequestHandler = async (req, res) => {
    const result = await this.authService.login(req.body);
    this.setRefreshTokenCookie(res, 'refreshToken', result.refreshToken!);
    delete result.refreshToken;

    sendResponse(res, result);
  };

  logout: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies?.['refreshToken'];
    const { id } = req.user!;
    const result = await this.authService.logout(refreshToken, id);
    this.clearRefreshTokenCookie(res);

    sendResponse(res, result);
  };

  refreshToken: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies?.['refreshToken'];
    const result = await this.authService.refreshToken(refreshToken);
    this.setRefreshTokenCookie(res, 'refreshToken', result.refreshToken!);
    delete result.refreshToken;

    sendResponse(res, result);
  };

  setRefreshTokenCookie = (res: Response, name: string, token: string) => {
    const options: CookieOptions = {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: env.NODE_ENV === 'production', // In production cookie will be sent only via HTTPs - encrypted
      maxAge: 7 * 24 * 60 * 60 * 100, // default max age of 7 days
    };

    if (name === 'refreshToken')
      options.maxAge = parseExpiresInMs(
        `${env.REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
      );

    res.cookie(name, token, options);
  };

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }
}
