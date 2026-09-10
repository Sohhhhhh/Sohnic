import { NextFunction, Request, Response } from 'express';
import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { UserRole } from '../../drizzle/schema';

export const isAuthorized = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role.role))
      return next(
        new APIError(
          'You do not have permission to perform this action.',
          STATUS_CODES.Forbidden,
        ),
      );
    next();
  };
};
