import { RequestHandler } from 'express';
import { branchIdSchema } from '../dtos/common/branchId.dto';
import { idSchema } from '../dtos/common/id.dto';
import { itemIdSchema } from '../dtos/common/itemId.dto';
import { paginationSchema } from '../dtos/common/pagination.dto';
import { validate } from '../middlewares/validate';

// Usage: CombinedValidator<typeof validateId, typeof validateUpdateSupplier>
export type CombinedValidator<A, B> =
  A extends RequestHandler<infer P1, any, infer B1, infer Q1>
    ? B extends RequestHandler<infer P2, any, infer B2, infer Q2>
      ? RequestHandler<P1 & P2, any, B1 & B2, Q1 & Q2>
      : never
    : never;

// ID
export const validateId = validate({
  params: idSchema,
});
export type idValidatedCtrlr = typeof validateId;

// PAGINATION
export const validatePagination = validate({
  query: paginationSchema,
});
export type paginationValidatedCtrlr = typeof validatePagination;

// BRANCH ID
export const validateBranchId = validate({
  body: branchIdSchema,
});
export type branchIdValidatedCtrlr = typeof validateBranchId;

// ITEM ID
export const validateItemId = validate({
  body: itemIdSchema,
});
export type itemIdValidatedCtrlr = typeof validateItemId;
