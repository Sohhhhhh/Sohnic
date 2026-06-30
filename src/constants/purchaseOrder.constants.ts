import { PurchaseOrderStatus, ReturnRequestStatus } from '../../drizzle/schema';

export const PURCH_ORDS_VALID_TRANSITIONS: Partial<
  Record<PurchaseOrderStatus, PurchaseOrderStatus>
> = {
  pending: 'approved',
  approved: 'shipped',
  shipped: 'delivered',
};

export const RETURN_REQS_VALID_TRANSITIONS: Partial<
  Record<ReturnRequestStatus, ReturnRequestStatus>
> = {
  pending: 'approved',
  approved: 'completed',
};
