import { validate } from '../middlewares/validate';
import { createReturnSchema } from '../dtos/returns/createReturn.dto';
import { filterReturnsQuerySchema } from '../dtos/returns/filterReturns.dto';

// CREATE RETURN
export const validateCreateReturn = validate({
  body: createReturnSchema,
});
export type createSuppRetValidatedCtrlr = typeof validateCreateReturn;

// FILTER RETURNS
export const validateFilterReturns = validate({
  query: filterReturnsQuerySchema,
});
export type filterSuppRetsValidatedCtrlr = typeof validateFilterReturns;
