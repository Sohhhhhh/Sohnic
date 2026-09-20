import { TransferRequestStatus } from '../../drizzle/schema';

export const TRANSFER_REQ_NON_CANCELLABLE: TransferRequestStatus[] = [
  'rejected',
  'in_transit',
  'received',
  'completed',
  'cancelled',
];
