import { NextFunction, Request, Response } from 'express';

import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';
import { verifyAccessToken } from '../utils/token';
import UserRepository from '../repositories/users.repository';

export default async (req: Request, res: Response, next: NextFunction) => {
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

  const user = await UserRepository.getUserById(verified.userId);
  if (!user)
    throw new APIError(
      'This user does no longer exist',
      STATUS_CODES.Unauthorized,
    );

  req.user = user;
  next();
};
