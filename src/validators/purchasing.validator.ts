import { validate } from '../middlewares/validate';
import { createPurchaseRequestSchema } from '../dtos/purchasing/createPurchaseRequest.dto';

// CREATE PURCHASE REQUEST
export const validateCreatePurchaseRequest = validate({
  body: createPurchaseRequestSchema,
});
export type createPurchaseRequestValidatedCtrlr =
  typeof validateCreatePurchaseRequest;
