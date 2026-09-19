import { validate } from '../middlewares/validate';
import { createTransferRequestSchema } from '../dtos/transfers/createTransferRequest.dto';
import { filterTransferRequestsQuerySchema } from '../dtos/transfers/filterTransferRequests.dto';

// CREATE TRANSFE REQUEST
export const validateCreateTransferRequest = validate({
  body: createTransferRequestSchema,
});
export type createTransferRequestValidatedCtrlr =
  typeof validateCreateTransferRequest;

// FILTER TRANSFER REQUESTS
export const validateFilterTransferRequests = validate({
  query: filterTransferRequestsQuerySchema,
});
export type filterTransferRequestsValidatedCtrlr =
  typeof validateFilterTransferRequests;
