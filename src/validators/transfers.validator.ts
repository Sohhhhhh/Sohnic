import { validate } from '../middlewares/validate';
import { createTransferRequestSchema } from '../dtos/transfers/createTransferRequest.dto';
import { filterTransferRequestsQuerySchema } from '../dtos/transfers/filterTransferRequests.dto';
import { approveTransferRequestSchema } from '../dtos/transfers/approveTransferRequest.dto';
import { rejectTransferRequestSchema } from '../dtos/transfers/rejectTransferRequest.dto';
import { receiveTransferRequestSchema } from '../dtos/transfers/receiveTransferRequest.dto';

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

// APPROVE TRANSFER REQUEST
export const validateApproveTransferRequest = validate({
  body: approveTransferRequestSchema,
});
export type approveTransferRequestValidatedCtrlr =
  typeof validateApproveTransferRequest;

// REJECT TRANSFER REQUEST
export const validateRejectTransferRequest = validate({
  body: rejectTransferRequestSchema,
});
export type rejectTransferRequestValidatedCtrlr =
  typeof validateRejectTransferRequest;

// RECEIVE TRANSFER REQUEST
export const validateReceiveTransferRequest = validate({
  body: receiveTransferRequestSchema,
});
export type receiveTransferRequestValidatedCtrlr =
  typeof validateReceiveTransferRequest;
