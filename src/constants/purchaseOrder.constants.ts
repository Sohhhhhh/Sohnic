import { PurchaseOrderStatus } from '../../drizzle/schema';

export const VALID_TRANSITIONS: Partial<
  Record<PurchaseOrderStatus, PurchaseOrderStatus>
> = {
  pending: 'approved',
  approved: 'shipped',
  shipped: 'delivered',
};
