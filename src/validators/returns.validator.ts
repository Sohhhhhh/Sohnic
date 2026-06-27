import { validate } from '../middlewares/validate';
import { createSupplierReturnSchema } from '../dtos/returns/supplier-returns/createSupplierReturn.dto';

// CREATE SUPPLIER RETURN
export const validateCreateSupplierReturn = validate({
  body: createSupplierReturnSchema,
});
export type createSuppRetValidatedCtrlr = typeof validateCreateSupplierReturn;
