import { createCategorySchema } from "../dtos/categories/createCategory.dto";
import { validate } from "../middlewares/validate";

// CREATE CATEGORY
export const validateCreateCategory = validate({
  body: createCategorySchema,
});
export type createCategoryValidatedCtrlr = typeof validateCreateCategory;
