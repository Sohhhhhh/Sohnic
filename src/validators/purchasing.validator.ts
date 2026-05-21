import { validate } from '../middlewares/validate';
import { createPurchaseRequestSchema } from '../dtos/purchasing/createPurchaseRequest.dto';
import { filterPurchaseRequestsQuerySchema } from '../dtos/purchasing/filterPurchaseRequests.dto';

// CREATE PURCHASE REQUEST
export const validateCreatePurchaseRequest = validate({
  body: createPurchaseRequestSchema,
});
export type createPurchaseRequestValidatedCtrlr =
  typeof validateCreatePurchaseRequest;

// FILTER PURCHASE REQUESTS
export const validateFilterPurchaseRequests = validate({
  query: filterPurchaseRequestsQuerySchema,
});
export type filterPurchaseRequestsValidatedCtrlr =
  typeof validateFilterPurchaseRequests;
