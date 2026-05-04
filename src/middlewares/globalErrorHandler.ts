import { ZodError } from 'zod';
import { PostgresError } from 'postgres';
import { NextFunction, Request, Response } from 'express';
import {
  HttpException,
  HttpUnprocessableEntity,
  isHttpException,
} from '@httpx/exception';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import env from '../config/env';
import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';

const sendErrorDev = (err: APIError, res: Response) => {
  res.status(err.statusCode).json({
    error: err,
    stack: err.stack,
    message: err.message,
    statusCode: err.statusCode,
    ...(err.issues && { issues: err.issues }),
  });
};

const sendErrorProd = (err: APIError, res: Response) => {
  if (err.isOperational)
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      ...(err.issues && { issues: err.issues }),
    });

  return res.status(STATUS_CODES.InternalServerError).json({
    statusCode: STATUS_CODES.InternalServerError,
    message: 'Something went wrong, Please try again later.',
  });
};

export default (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Convert known errors to APIError
  let error = convertToAPIError(err);
  error.statusCode = error.statusCode || 500;

  if (env.NODE_ENV === 'development') sendErrorDev(error, res);
  if (env.NODE_ENV === 'production') sendErrorProd(error, res);
};

// ----HELPERS----

// Handle Zod validation errors
const handleZodError = (err: ZodError): APIError => {
  const message = err.issues
    .map((e) => `${e.path.join('.')}: ${e.message}`)
    .join(', ');
  return new APIError(`Validation error: ${message}`, STATUS_CODES.BadRequest);
};

// Handle JWT errors
const handleJWTError = (): APIError => {
  return new APIError(
    'Invalid token. Please log in again.',
    STATUS_CODES.Unauthorized,
  );
};

const handleJWTExpiredError = (): APIError => {
  return new APIError(
    'Token expired. Please log in again.',
    STATUS_CODES.Unauthorized,
  );
};

const handleHttpError = (err: HttpException): APIError => {
  const issues = (err as HttpUnprocessableEntity).issues;
  return new APIError(err.message, err.statusCode, issues);
};

// Handle database errors
const handleDatabaseError = (err: PostgresError): APIError => {
  // Postgres unique constraint violation
  if (err.code === '23505') {
    return new APIError('Duplicate field value entered', STATUS_CODES.Conflict);
  }

  // Postgres foreign key violation
  if (err.code === '23503') {
    return new APIError(
      'Invalid reference to related data',
      STATUS_CODES.BadRequest,
    );
  }

  return new APIError(
    'Database error occurred',
    STATUS_CODES.InternalServerError,
  );
};

const convertToAPIError = (err: unknown): APIError => {
  if (err instanceof ZodError || (err as any)?.name === 'ZodError')
    return handleZodError(err as ZodError);
  else if (isHttpException(err)) return handleHttpError(err);
  else if (err instanceof JsonWebTokenError) return handleJWTError();
  else if (err instanceof TokenExpiredError) return handleJWTExpiredError();
  else if (err instanceof PostgresError) return handleDatabaseError(err);
  else if (err instanceof APIError) return err;
  else if (err instanceof Error)
    return new APIError(err.message, STATUS_CODES.InternalServerError);
  else return new APIError('Unknown error', STATUS_CODES.InternalServerError);
};
