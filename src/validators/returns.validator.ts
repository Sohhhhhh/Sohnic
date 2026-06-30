import { validate } from '../middlewares/validate';
import { createSupplierReturnSchema } from '../dtos/returns/supplier-returns/createSupplierReturn.dto';
import { filterSupplierReturnsQuerySchema } from '../dtos/returns/supplier-returns/filterSupplierReturns.dto';

// CREATE SUPPLIER RETURN
export const validateCreateSupplierReturn = validate({
  body: createSupplierReturnSchema,
});
export type createSuppRetValidatedCtrlr = typeof validateCreateSupplierReturn;

// FILTER SUPPLIER RETURNS
export const validateFilterSupplierReturns = validate({
  query: filterSupplierReturnsQuerySchema,
});
export type filterSuppRetsValidatedCtrlr = typeof validateFilterSupplierReturns;
