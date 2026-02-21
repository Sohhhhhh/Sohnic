import { NextFunction, Request, Response } from 'express';
import APIError from '../utils/APIError';
import statusCodes from '../utils/statusCodes';
import env from '../config/env';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { PostgresError } from 'postgres';

const sendErrorDev = (err: APIError, res: Response) => {
  res.status(err.statusCode).json({
    error: err,
    stack: err.stack,
    message: err.message,
    statusCode: err.statusCode,
  });
};

const sendErrorProd = (err: APIError, res: Response) => {
  if (err.isOperational)
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });

  return res.status(statusCodes.InternalServerError).json({
    statusCode: statusCodes.InternalServerError,
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
  const message = err.errors
    .map((e) => `${e.path.join('.')}: ${e.message}`)
    .join(', ');
  return new APIError(`Validation error: ${message}`, statusCodes.BadRequest);
};

// Handle JWT errors
const handleJWTError = (): APIError => {
  return new APIError(
    'Invalid token. Please log in again.',
    statusCodes.Unauthorized,
  );
};

const handleJWTExpiredError = (): APIError => {
  return new APIError(
    'Token expired. Please log in again.',
    statusCodes.Unauthorized,
  );
};

// Handle database errors
const handleDatabaseError = (err: PostgresError): APIError => {
  // Postgres unique constraint violation
  if (err.code === '23505') {
    return new APIError('Duplicate field value entered', statusCodes.Conflict);
  }

  // Postgres foreign key violation
  if (err.code === '23503') {
    return new APIError(
      'Invalid reference to related data',
      statusCodes.BadRequest,
    );
  }

  return new APIError(
    'Database error occurred',
    statusCodes.InternalServerError,
  );
};

const convertToAPIError = (err: unknown): APIError => {
  if (err instanceof ZodError) return handleZodError(err);
  else if (err instanceof JsonWebTokenError) return handleJWTError();
  else if (err instanceof TokenExpiredError) return handleJWTExpiredError();
  else if (err instanceof PostgresError) return handleDatabaseError(err);
  else if (err instanceof APIError) return err;
  else if (err instanceof Error)
    return new APIError(err.message, statusCodes.InternalServerError);
  else return new APIError('Unknown error', statusCodes.InternalServerError);
};
