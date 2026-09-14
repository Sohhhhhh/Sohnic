import { ManufacturingOrderStatus } from '../../drizzle/schema';

export const MFG_ORDER_VALID_TRANSITIONS: Partial<
  Record<ManufacturingOrderStatus, ManufacturingOrderStatus>
> = {
  pending: 'approved',
  approved: 'materials_sent',
  materials_sent: 'in_production',
  in_production: 'completed',
};

export const MFG_ORDER_NON_CANCELLABLE: ManufacturingOrderStatus[] = [
  'completed',
  'cancelled',
  'rejected',
];
