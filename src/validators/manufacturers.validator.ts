import { validate } from '../middlewares/validate';
import { createManufacturerSchema } from '../dtos/manufacturers/createManufacturer.dto';

// CREATE MANUFACTURER
export const validateCreateManufacturer = validate({
  body: createManufacturerSchema,
});
export type createManufacturerValidatedCtrlr =
  typeof validateCreateManufacturer;
