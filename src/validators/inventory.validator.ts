import { validate } from '../middlewares/validate';
import { adjustStockSchema } from '../dtos/inventory/adjustStock.dto';
import { filterInventorySchema } from '../dtos/inventory/filterInventory.dto';

// ADJUST STOCK
export const validateAdjustStock = validate({
  body: adjustStockSchema,
});

// UPDATE CATEGORY
export const validateFilterInventory = validate({
  body: filterInventorySchema,
});
export type filterInventoryValidatedCtrlr = typeof validateFilterInventory;
