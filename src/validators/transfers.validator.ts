import { validate } from '../middlewares/validate';
import { createTransferRequestSchema } from '../dtos/transfers/createTransferRequest.dto';

// CREATE TRANSFE REQUEST
export const validateCreateTransferRequest = validate({
  body: createTransferRequestSchema,
});
export type createTransferRequestValidatedCtrlr =
  typeof validateCreateTransferRequest;
