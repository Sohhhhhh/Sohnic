import { NextFunction, Request, Response } from 'express';

import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';
import { verifyAccessToken } from '../utils/token';
import { IRoleRepository, IUserRepository } from '../interfaces';

export const createAuthMiddleware = (
  userRepo: IUserRepository,
  roleRepo: IRoleRepository,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer')
    )
      throw new APIError(
        'You must be logged in to have access.',
        STATUS_CODES.Unauthorized,
      );

    const accessToken = req.headers.authorization.split(' ')[1];
    if (!accessToken)
      throw new APIError('Invalid or expired token', STATUS_CODES.Unauthorized);

    const verified = verifyAccessToken(accessToken);
    if (!verified)
      throw new APIError('Invalid or expired token', STATUS_CODES.Unauthorized);

    const [user, role] = await Promise.all([
      userRepo.getUserById(verified.userId),
      roleRepo.getById(verified.roleId),
    ]);

    if (!user)
      throw new APIError(
        'This user does no longer exist',
        STATUS_CODES.Unauthorized,
      );

    if (!user.isActive)
      throw new APIError(
        'This user is no longer active. Please contact IT.',
        STATUS_CODES.Unauthorized,
      );

    if (!role)
      throw new APIError('Invalid or expired token', STATUS_CODES.Unauthorized);

    req.user = { ...user, role };
    next();
  };
};
