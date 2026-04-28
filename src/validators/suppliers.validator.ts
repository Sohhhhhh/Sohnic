import { addItemSupplierSchema } from '../dtos/suppliers/addItemSupplier.dto';
import { createSupplierSchema } from '../dtos/suppliers/createSupplier.dto';
import { editItemSupplierSchema } from '../dtos/suppliers/editItemSupplier.dto';
import { updateSupplierSchema } from '../dtos/suppliers/updateSupplier.dto';
import { validate } from '../middlewares/validate';

// CREATE SUPPLIER
export const validateCreateSupplier = validate({
  body: createSupplierSchema,
});
export type createSupplierValidatedCtrlr = typeof validateCreateSupplier;

// UPDATE SUPPLIER
export const validateUpdateSupplier = validate({
  body: updateSupplierSchema,
});
export type updateSupplierValidatedCtrlr = typeof validateUpdateSupplier;

// ADD ITEM SUPPLIER
export const validateAddItemSupplier = validate({
  body: addItemSupplierSchema,
});
export type addItemSupplierValidatedCtrlr = typeof validateAddItemSupplier;

// EDIT ITEM SUPPLIER
export const validateEditItemSupplier = validate({
  body: editItemSupplierSchema,
});
export type editItemSupplierValidatedCtrlr = typeof validateEditItemSupplier;
