import { validate } from '../middlewares/validate';
import { createInspectionSchema } from '../dtos/inspections/createInspection.dto';
import { filterInspectionsQuerySchema } from '../dtos/inspections/filterInspections.dto';

// CREATE INSPECTION
export const validateCreateInspection = validate({
  body: createInspectionSchema,
});
export type createInspectionValidatedCtrlr = typeof validateCreateInspection;

// FILTER INSPECTIONS
export const validateFilterInspections = validate({
  query: filterInspectionsQuerySchema,
});
export type filterInspectionsValidatedCtrlr = typeof validateFilterInspections;
