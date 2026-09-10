import { validate } from '../middlewares/validate';
import { createManufacturerSchema } from '../dtos/manufacturers/createManufacturer.dto';
import { manufacturersQuerySchema } from '../dtos/manufacturers/filterManufacturers.dto';
import { updateManufacturerSchema } from '../dtos/manufacturers/updateManufacturer.dto';

// CREATE MANUFACTURER
export const validateCreateManufacturer = validate({
  body: createManufacturerSchema,
});
export type createManufacturerValidatedCtrlr =
  typeof validateCreateManufacturer;

// FILTER MANUFACTURERS (with pagination)
export const validateManufacturersQuery = validate({
  query: manufacturersQuerySchema,
});
export type manufacturersQueryValidatedCtrlr =
  typeof validateManufacturersQuery;

// UPDATE MANUFACTURER
export const validateUpdateManufacturer = validate({
  body: updateManufacturerSchema,
});
export type updateManufacturerValidatedCtrlr =
  typeof validateUpdateManufacturer;

