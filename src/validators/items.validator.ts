import { validate } from '../middlewares/validate';
import { createItemSchema } from '../dtos/items/createItem.dto';
import { updateItemSchema } from '../dtos/items/updateItem.dto';

// CREATE ITEM
export const validateCreateItem = validate({
  body: createItemSchema,
});
export type createItemValidatedCtrlr = typeof validateCreateItem;

// UPDATE ITEM
export const validateUpdateItem = validate({
  body: updateItemSchema,
});
export type updateItemValidatedCtrlr = typeof validateUpdateItem;
