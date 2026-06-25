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
    'new_login_from_another_device',
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
  'approved',
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

export const inspectionType = pgEnum('inspectionType', [
  'order',
  'manufacturing_batch',
  'transfer',
]);

export const returnRequestStatus = pgEnum('returnRequestStatus', [
  'pending',
  'approved',
  'rejected',
  'completed',
]);

export const itemsType = pgEnum('itemsType', ['sellable_item', 'raw_material']);

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


export type UserRole = (typeof userRole.enumValues)[number];
export type RefreshTokensRevocationReason =
  (typeof refreshTokensRevocationReason.enumValues)[number];
export type BranchType = (typeof branchType.enumValues)[number];
export type PurchaseRequestStatus =
  (typeof purchaseRequestStatus.enumValues)[number];
export type PurchaseOrderStatus =
  (typeof purchaseOrderStatus.enumValues)[number];
export type ManufacturingOrderStatus =
  (typeof manufacturingOrderStatus.enumValues)[number];
export type DeliveryStatus = (typeof deliveryStatus.enumValues)[number];
export type TransferRequestStatus =
  (typeof transferRequestStatus.enumValues)[number];
export type InspectionStatus = (typeof inspectionStatus.enumValues)[number];
export type InspectionType = (typeof inspectionType.enumValues)[number];
export type ReturnRequestStatus =
  (typeof returnRequestStatus.enumValues)[number];
export type ItemsType = (typeof itemsType.enumValues)[number];
export type PaymentMethod = (typeof paymentMethod.enumValues)[number];
export type CustomerType = (typeof customerType.enumValues)[number];
export type SellableItemType = (typeof sellableItemType.enumValues)[number];
