import { validate } from '../middlewares/validate';
import { createManufacturingOrderSchema } from '../dtos/manufacturing-orders/createManufacturingOrder.dto';

// CREATE MANUFACTURING ORDER
export const validateCreateManufacturingOrder = validate({
  body: createManufacturingOrderSchema,
});
export type createManufacturingOrderValidatedCtrlr =
  typeof validateCreateManufacturingOrder;
