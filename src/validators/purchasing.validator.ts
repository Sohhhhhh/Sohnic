import { validate } from '../middlewares/validate';
import { createPurchaseOrderSchema } from '../dtos/purchasing/createPurchaseOrder.dto';
import { createPurchaseRequestSchema } from '../dtos/purchasing/createPurchaseRequest.dto';
import { rejectPurchaseRequestSchema } from '../dtos/purchasing/rejectPurchaseRequest.dto';
import { createSupplierQuotationSchema } from '../dtos/purchasing/createSupplierQuotation.dto';
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

// REJECT PURCHASE REQUEST
export const validateRejectPurchaseRequest = validate({
  body: rejectPurchaseRequestSchema,
});
export type rejectPurchaseRequestValidatedCtrlr =
  typeof validateRejectPurchaseRequest;

// CREATE SUPPLIER QUOTATION
export const validateCreateSupplierQuotation = validate({
  body: createSupplierQuotationSchema,
});
export type createSupplierQuotationValidatedCtrlr =
  typeof validateCreateSupplierQuotation;

// CREATE PURCHASE ORDER
export const validateCreatePurchaseOrder = validate({
  body: createPurchaseOrderSchema,
});
export type createPurchaseOrderValidatedCtrlr =
  typeof validateCreatePurchaseOrder;
