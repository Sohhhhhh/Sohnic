import { validate } from '../middlewares/validate';
import { createManufacturerSchema } from '../dtos/manufacturers/createManufacturer.dto';
import { manufacturersQuerySchema } from '../dtos/manufacturers/filterManufacturers.dto';

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

