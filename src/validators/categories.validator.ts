import { validate } from '../middlewares/validate';
import { createCategorySchema } from '../dtos/categories/createCategory.dto';
import { updateCategorySchema } from '../dtos/categories/updateCategory.dto';

// CREATE CATEGORY
export const validateCreateCategory = validate({
  body: createCategorySchema,
});
export type createCategoryValidatedCtrlr = typeof validateCreateCategory;

// UPDATE CATEGORY
export const validateUpdateCategory = validate({
  body: updateCategorySchema,
});
export type updateCategoryValidatedCtrlr = typeof validateUpdateCategory;
