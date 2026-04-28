import { ZodSchema } from 'zod';
import { validate as zodExpressValidator } from 'zod-express-validator';
import { HttpUnprocessableEntity, HttpValidationIssue } from '@httpx/exception';

export function validate<Body, Query, Params, Res>(schema: {
  body?: ZodSchema<Body>;
  query?: ZodSchema<Query & PropertyDescriptor>;
  params?: ZodSchema<Params>;
  res?: ZodSchema<Res>;
}) {
  return zodExpressValidator(
    schema,
    ({ bodyError, queryError, paramsError }, res) => {
      const errors = bodyError ?? queryError ?? paramsError;
      if (errors) {
        throw new HttpUnprocessableEntity({
          message: 'Validation Error',
          issues: errors.issues as HttpValidationIssue[],
        });
      }
      return res;
    },
  );
}
