import { Request, Response, NextFunction } from 'express';

import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';

const IMMUTABLE_ITEM_FIELDS = [
  'type',
  'sku',
  'modelNumber',
  'sellableType',
] as const;

export const checkImmutableItemFields = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const body = req.body || {};
  if (typeof body !== 'object' || Array.isArray(body)) return next();

  const attempted = IMMUTABLE_ITEM_FIELDS.filter((field) => field in body);

  if (attempted.length > 0)
    throw new APIError(
      `The following fields cannot be edited: ${attempted.join(', ')}`,
      STATUS_CODES.BadRequest,
    );

  next();
};
