import { validate } from '../middlewares/validate';
import { createManufacturingOrderSchema } from '../dtos/manufacturing-orders/createManufacturingOrder.dto';
import { filterManufacturingOrdersQuerySchema } from '../dtos/manufacturing-orders/filterManufacturingOrder.dto';
import { rejectManufacturingOrderSchema } from '../dtos/manufacturing-orders/rejectManufacturingOrder.dto';

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

// REJECT MANUFACTURING ORDERS (with pagination)
export const validateRejectManufacturingOrders = validate({
  query: rejectManufacturingOrderSchema,
});
export type rejectManufacturingOrderValidatedCtrlr =
  typeof validateRejectManufacturingOrders;
