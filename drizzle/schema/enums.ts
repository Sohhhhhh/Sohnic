import { pgEnum } from 'drizzle-orm/pg-core';

export const userRole = pgEnum('userRole', [
  'super_admin',
  'branch_admin',
  'hr',
  'storage_manager',
  'accountant',
  'inspector',
  'cashier',
]);

export const refreshTokensRevocationReason = pgEnum(
  'refreshTokensRevocationReason',
  [
    'rotation',
    'reuse',
    'logout',
    'password_change',
    'password_reset',
    'deletion',
    'security',
    'other',
  ],
);

export const branchType = pgEnum('branchType', ['main', 'sub']);

export const purchaseRequestStatus = pgEnum('purchaseRequestStatus', [
  'pending',
  'approved',
  'rejected',
]);

export const purchaseOrderStatus = pgEnum('purchaseOrderStatus', [
  'pending',
  'shipped',
  'delivered',
  'cancelled',
]);

export const manufacturingOrderStatus = pgEnum('manufacturingOrderStatus', [
  'pending',
  'approved',
  'rejected',
  'in_production',
  'completed',
  'cancelled',
]);

export const deliveryStatus = pgEnum('deliveryStatus', [
  'in_transit',
  'delivered',
]);

export const transferRequestStatus = pgEnum('transferRequestStatus', [
  'pending',
  'approved',
  'rejected',
  'in_transit',
  'received',
  'completed',
]);

export const inspectionStatus = pgEnum('inspectionStatus', [
  'passed',
  'failed',
  'needs_rework',
]);

export const returnRequestStatus = pgEnum('returnRequestStatus', [
  'pending',
  'approved',
  'rejected',
  'completed',
]);

export const returnRequestType = pgEnum('returnRequestType', [
  'sellable_item',
  'raw_material',
]);

export const paymentMethod = pgEnum('paymentMethod', [
  'cash',
  'credit_card',
  'debit_card',
  'bank_transfer',
  'mobile_payment',
]);

export const customerType = pgEnum('customerType', [
  'individual',
  'business',
  'educational',
]);

export const sellableItemType = pgEnum('sellableItemType', [
  'finished',
  'resale',
]);

export const productCategory = pgEnum('productCategory', [
  'development_boards',
  'sensor_modules',
  'communication_modules',
  'power_management',
  'display_modules',
  'motor_drivers',
  'interface_conversion',
  'audio_signal_processing',
]);
