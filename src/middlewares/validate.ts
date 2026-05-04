import { RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ParamsDictionary } from 'express-serve-static-core';
import { HttpUnprocessableEntity, HttpValidationIssue } from '@httpx/exception';

export function validate<
  Body = any,
  Query = any,
  Params extends ParamsDictionary = ParamsDictionary,
>(schema: {
  body?: ZodSchema<Body>;
  query?: ZodSchema<Query>;
  params?: ZodSchema<Params>;
}): RequestHandler<Params, any, Body, any> {
  return (req, res, next) => {
    try {
      if (schema.body) req.body = schema.body.parse(req.body);
      if (schema.query) req.query = schema.query.parse(req.query) as any;
      if (schema.params) req.params = schema.params.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new HttpUnprocessableEntity({
          message: 'Validation Error',
          issues: err.issues as HttpValidationIssue[],
        });
      }
      next(err);
    }
  };
}
