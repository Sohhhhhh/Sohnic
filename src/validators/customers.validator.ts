import { validate } from '../middlewares/validate';
import { createCustomerSchema } from '../dtos/customers/createCustomer.dto';
import { updateCustomerSchema } from '../dtos/customers/updateCustomer.dto';
import { findCustomerByPhoneSchema } from '../dtos/customers/findCustomerByPhone.dto';

// CREATE CUSTOMER
export const validateCreateCustomer = validate({ body: createCustomerSchema });
export type createCustomerValidatedCtrlr = typeof validateCreateCustomer;

// UPDATE CUSTOMER
export const validateUpdateCustomer = validate({
  body: updateCustomerSchema,
});
export type updateCustomerValidatedCtrlr = typeof validateUpdateCustomer;

// FIND CUSTOMER BY PHONE
export const validateFindCustomerByPhone = validate({
  query: findCustomerByPhoneSchema,
});
export type findCustomerByPhoneValidatedCtrlr =
  typeof validateFindCustomerByPhone;
