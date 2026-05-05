import { validate } from '../middlewares/validate';
import { createSupplierSchema } from '../dtos/suppliers/createSupplier.dto';
import { updateSupplierSchema } from '../dtos/suppliers/updateSupplier.dto';
import { addItemSupplierSchema } from '../dtos/suppliers/addItemSupplier.dto';
import { filterSuppliersSchema } from '../dtos/suppliers/filterSuppliers.dto';
import { editItemSupplierSchema } from '../dtos/suppliers/editItemSupplier.dto';
import {
  filterItemSuppliersSchema,
  itemSuppliersQuerySchema,
} from '../dtos/suppliers/filterItemSuppliers.dto';

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

// FILTER SUPPLIER
export const validateFilterSuppliers = validate({
  query: filterSuppliersSchema,
});
export type filterSuppliersValidatedCtrlr = typeof validateFilterSuppliers;

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

// FILTER ITEM SUPPLIER
export const validateFilterItemSuppliers = validate({
  query: filterItemSuppliersSchema,
});
export type filterItemSuppliersValidatedCtrlr =
  typeof validateFilterItemSuppliers;

export const validateItemSuppliersQuery = validate({
  query: itemSuppliersQuerySchema,
});
export type itemSuppliersQueryValidatedCtrlr =
  typeof validateItemSuppliersQuery;
