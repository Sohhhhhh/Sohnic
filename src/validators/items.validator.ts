import { validate } from '../middlewares/validate';
import { createItemSchema } from '../dtos/items/createItem.dto';
import { updateItemSchema } from '../dtos/items/updateItem.dto';
import { paginationSchema } from '../dtos/common/pagination.dto';
import { filterItemsSchema } from '../dtos/items/filterItems.dto';

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

// FILTER ITEMS
const filterItemsQuerySchema = filterItemsSchema.merge(paginationSchema);
export const validateFilterItems = validate({
  query: filterItemsQuerySchema,
});
export type filterItemsValidatedCtrlr = typeof validateFilterItems;
