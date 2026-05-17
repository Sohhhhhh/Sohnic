import { createItemSchema } from '../dtos/items/createItem.dto';
import { validate } from '../middlewares/validate';

// CREATE ITEM
export const validateCreateItem = validate({
  body: createItemSchema,
});
export type createItemValidatedCtrlr = typeof validateCreateItem;
