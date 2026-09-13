import { validate } from '../middlewares/validate';
import { createManufacturingOrderSchema } from '../dtos/manufacturing-orders/createManufacturingOrder.dto';
import { filterManufacturingOrdersQuerySchema } from '../dtos/manufacturing-orders/filterManufacturingOrder.dto';

// CREATE MANUFACTURING ORDER
export const validateCreateManufacturingOrder = validate({
  body: createManufacturingOrderSchema,
});
export type createManufacturingOrderValidatedCtrlr =
  typeof validateCreateManufacturingOrder;

// FILTER MANUFACTURING ORDERS (with pagination)
export const validateFilterManufacturingOrders = validate({
  query: filterManufacturingOrdersQuerySchema,
});
export type filterManufacturingOrderValidatedCtrlr =
  typeof validateFilterManufacturingOrders;
