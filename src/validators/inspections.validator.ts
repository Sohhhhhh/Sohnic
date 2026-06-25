import { validate } from '../middlewares/validate';
import { createInspectionSchema } from '../dtos/inspections/createInspection.dto';

export const validateCreateInspection = validate({
  body: createInspectionSchema,
});
export type createInspectionValidatedCtrlr = typeof validateCreateInspection;
