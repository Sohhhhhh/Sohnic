import { relations } from 'drizzle-orm';
import { users, roles, refreshTokens, setPasswordTokens } from './users';
import { branches, warehouses } from './locations';
import { categories, items, billOfMaterials } from './products';
import { customers, orders, orderItems } from './customers';
import {
  suppliers,
  itemSuppliers,
  supplierQuotations,
  quotationItems,
} from './suppliers';
import {
  purchaseRequests,
  purchaseRequestItems,
  purchaseOrders,
  purchaseOrderItems,
} from './purchasing';
import { inventory } from './inventory';
import {
  manufacturers,
  manufacturingOrders,
  manufacturingBatches,
} from './manufacturing';
import {
  transferRequests,
  transferRequestItems,
  transferOrders,
} from './transfers';
import { inspections } from './inspections';
import { supplierReturns, manufacturerReturns } from './returns';

// ─── Users ───

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, { fields: [users.roleId], references: [roles.id] }),
  branch: one(branches, {
    fields: [users.branchId],
    references: [branches.id],
  }),
  refreshTokens: many(refreshTokens),
  setPasswordTokens: many(setPasswordTokens),
  ordersAsCashier: many(orders),
  purchaseRequestsOrdered: many(purchaseRequests, { relationName: 'orderer' }),
  purchaseRequestsReviewed: many(purchaseRequests, {
    relationName: 'reviewer',
  }),
  purchaseOrdersCreated: many(purchaseOrders, { relationName: 'creator' }),
  purchaseOrdersApproved: many(purchaseOrders, { relationName: 'approver' }),
  manufacturingOrdersCreated: many(manufacturingOrders, {
    relationName: 'creator',
  }),
  manufacturingOrdersApproved: many(manufacturingOrders, {
    relationName: 'approver',
  }),
  transferRequestsApproved: many(transferRequests),
  inspections: many(inspections),
  supplierReturnsAsInspector: many(supplierReturns, {
    relationName: 'inspector',
  }),
  supplierReturnsAsApprover: many(supplierReturns, {
    relationName: 'approver',
  }),
  manufacturerReturnsAsInspector: many(manufacturerReturns, {
    relationName: 'inspector',
  }),
  manufacturerReturnsAsApprover: many(manufacturerReturns, {
    relationName: 'approver',
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}));

export const setPasswordTokensRelations = relations(
  setPasswordTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [setPasswordTokens.userId],
      references: [users.id],
    }),
  }),
);

// ─── Locations ───

export const branchesRelations = relations(branches, ({ many }) => ({
  users: many(users),
  warehouses: many(warehouses),
  orders: many(orders),
  purchaseRequests: many(purchaseRequests),
  transferRequestsBy: many(transferRequests, { relationName: 'requestedBy' }),
  transferRequestsFrom: many(transferRequests, {
    relationName: 'requestedFrom',
  }),
}));

export const warehousesRelations = relations(warehouses, ({ one, many }) => ({
  branch: one(branches, {
    fields: [warehouses.branchId],
    references: [branches.id],
  }),
  inventory: many(inventory),
}));

// ─── Products ───

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parentCategory: one(categories, {
    fields: [categories.parentCategoryId],
    references: [categories.id],
    relationName: 'subcategories',
  }),
  subcategories: many(categories, { relationName: 'subcategories' }),
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
  itemSuppliers: many(itemSuppliers),
  inventory: many(inventory),
  billOfMaterialsAsProduct: many(billOfMaterials, { relationName: 'product' }),
  billOfMaterialsAsComponent: many(billOfMaterials, {
    relationName: 'component',
  }),
  quotationItems: many(quotationItems),
  purchaseRequestItems: many(purchaseRequestItems),
  purchaseOrderItems: many(purchaseOrderItems),
  inspections: many(inspections),
  transferRequestItems: many(transferRequestItems),
  manufacturingOrders: many(manufacturingOrders),
}));

export const billOfMaterialsRelations = relations(
  billOfMaterials,
  ({ one }) => ({
    product: one(items, {
      fields: [billOfMaterials.itemId],
      references: [items.id],
      relationName: 'product',
    }),
    component: one(items, {
      fields: [billOfMaterials.componentId],
      references: [items.id],
      relationName: 'component',
    }),
  }),
);

// ─── Customers & Sales ───

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  branch: one(branches, {
    fields: [orders.branchId],
    references: [branches.id],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  cashier: one(users, { fields: [orders.cashierId], references: [users.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  item: one(items, { fields: [orderItems.itemId], references: [items.id] }),
}));

// ─── Suppliers ───

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  itemSuppliers: many(itemSuppliers),
  quotations: many(supplierQuotations),
  purchaseOrders: many(purchaseOrders),
  returns: many(supplierReturns),
}));

export const itemSuppliersRelations = relations(itemSuppliers, ({ one }) => ({
  item: one(items, { fields: [itemSuppliers.itemId], references: [items.id] }),
  supplier: one(suppliers, {
    fields: [itemSuppliers.supplierId],
    references: [suppliers.id],
  }),
}));

export const supplierQuotationsRelations = relations(
  supplierQuotations,
  ({ one, many }) => ({
    purchaseRequest: one(purchaseRequests, {
      fields: [supplierQuotations.purchaseRequestId],
      references: [purchaseRequests.id],
    }),
    supplier: one(suppliers, {
      fields: [supplierQuotations.supplierId],
      references: [suppliers.id],
    }),
    items: many(quotationItems),
    purchaseOrders: many(purchaseOrders),
  }),
);

export const quotationItemsRelations = relations(quotationItems, ({ one }) => ({
  quotation: one(supplierQuotations, {
    fields: [quotationItems.quotationId],
    references: [supplierQuotations.id],
  }),
  item: one(items, { fields: [quotationItems.itemId], references: [items.id] }),
}));

// ─── Purchasing ───

export const purchaseRequestsRelations = relations(
  purchaseRequests,
  ({ one, many }) => ({
    orderer: one(users, {
      fields: [purchaseRequests.ordererId],
      references: [users.id],
      relationName: 'orderer',
    }),
    reviewer: one(users, {
      fields: [purchaseRequests.reviewerId],
      references: [users.id],
      relationName: 'reviewer',
    }),
    branch: one(branches, {
      fields: [purchaseRequests.branchId],
      references: [branches.id],
    }),
    items: many(purchaseRequestItems),
    quotations: many(supplierQuotations),
  }),
);

export const purchaseRequestItemsRelations = relations(
  purchaseRequestItems,
  ({ one }) => ({
    purchaseRequest: one(purchaseRequests, {
      fields: [purchaseRequestItems.purchaseRequestId],
      references: [purchaseRequests.id],
    }),
    item: one(items, {
      fields: [purchaseRequestItems.itemId],
      references: [items.id],
    }),
  }),
);

export const purchaseOrdersRelations = relations(
  purchaseOrders,
  ({ one, many }) => ({
    quotation: one(supplierQuotations, {
      fields: [purchaseOrders.quotationId],
      references: [supplierQuotations.id],
    }),
    supplier: one(suppliers, {
      fields: [purchaseOrders.supplierId],
      references: [suppliers.id],
    }),
    createdBy: one(users, {
      fields: [purchaseOrders.createdById],
      references: [users.id],
      relationName: 'creator',
    }),
    approvedBy: one(users, {
      fields: [purchaseOrders.approvedById],
      references: [users.id],
      relationName: 'approver',
    }),
    items: many(purchaseOrderItems),
    inspections: many(inspections),
    returns: many(supplierReturns),
  }),
);

export const purchaseOrderItemsRelations = relations(
  purchaseOrderItems,
  ({ one }) => ({
    order: one(purchaseOrders, {
      fields: [purchaseOrderItems.orderId],
      references: [purchaseOrders.id],
    }),
    item: one(items, {
      fields: [purchaseOrderItems.itemId],
      references: [items.id],
    }),
  }),
);

// ─── inventory ───

export const inventoryRelations = relations(inventory, ({ one }) => ({
  item: one(items, { fields: [inventory.itemId], references: [items.id] }),
  warehouse: one(warehouses, {
    fields: [inventory.warehouseId],
    references: [warehouses.id],
  }),
}));

// ─── Manufacturing ───

export const manufacturersRelations = relations(manufacturers, ({ many }) => ({
  manufacturingOrders: many(manufacturingOrders),
  returns: many(manufacturerReturns),
}));

export const manufacturingOrdersRelations = relations(
  manufacturingOrders,
  ({ one, many }) => ({
    product: one(items, {
      fields: [manufacturingOrders.productId],
      references: [items.id],
    }),
    createdBy: one(users, {
      fields: [manufacturingOrders.createdById],
      references: [users.id],
      relationName: 'creator',
    }),
    approvedBy: one(users, {
      fields: [manufacturingOrders.approvedById],
      references: [users.id],
      relationName: 'approver',
    }),
    manufacturer: one(manufacturers, {
      fields: [manufacturingOrders.manufacturerId],
      references: [manufacturers.id],
    }),
    batches: many(manufacturingBatches),
    returns: many(manufacturerReturns),
  }),
);

export const manufacturingBatchesRelations = relations(
  manufacturingBatches,
  ({ one, many }) => ({
    manufacturingOrder: one(manufacturingOrders, {
      fields: [manufacturingBatches.manufacturingOrderId],
      references: [manufacturingOrders.id],
    }),
    inspections: many(inspections),
  }),
);

// ─── Transfers ───

export const transferRequestsRelations = relations(
  transferRequests,
  ({ one, many }) => ({
    requestedByBranch: one(branches, {
      fields: [transferRequests.requestedByBranch],
      references: [branches.id],
      relationName: 'requestedBy',
    }),
    requestedFromBranch: one(branches, {
      fields: [transferRequests.requestedFromBranch],
      references: [branches.id],
      relationName: 'requestedFrom',
    }),
    approvedBy: one(users, {
      fields: [transferRequests.approvedById],
      references: [users.id],
    }),
    items: many(transferRequestItems),
    orders: many(transferOrders),
  }),
);

export const transferRequestItemsRelations = relations(
  transferRequestItems,
  ({ one }) => ({
    item: one(items, {
      fields: [transferRequestItems.itemId],
      references: [items.id],
    }),
    transferRequest: one(transferRequests, {
      fields: [transferRequestItems.transferRequestId],
      references: [transferRequests.id],
    }),
  }),
);

export const transferOrdersRelations = relations(
  transferOrders,
  ({ one, many }) => ({
    transferRequest: one(transferRequests, {
      fields: [transferOrders.transferRequestId],
      references: [transferRequests.id],
    }),
    inspections: many(inspections),
  }),
);

// ─── inspections ───

export const inspectionsRelations = relations(inspections, ({ one }) => ({
  purchaseOrder: one(purchaseOrders, {
    fields: [inspections.orderId],
    references: [purchaseOrders.id],
  }),
  manufacturingBatch: one(manufacturingBatches, {
    fields: [inspections.manufacturingBatchId],
    references: [manufacturingBatches.id],
  }),
  transferOrder: one(transferOrders, {
    fields: [inspections.transferOrderId],
    references: [transferOrders.id],
  }),
  item: one(items, { fields: [inspections.itemId], references: [items.id] }),
  inspector: one(users, {
    fields: [inspections.inspectorId],
    references: [users.id],
  }),
}));

// ─── Returns ───

export const supplierReturnsRelations = relations(
  supplierReturns,
  ({ one }) => ({
    inspector: one(users, {
      fields: [supplierReturns.inspectorId],
      references: [users.id],
      relationName: 'inspector',
    }),
    approver: one(users, {
      fields: [supplierReturns.approvedBy],
      references: [users.id],
      relationName: 'approver',
    }),
    inspection: one(inspections, {
      fields: [supplierReturns.inspectionId],
      references: [inspections.id],
    }),
    supplier: one(suppliers, {
      fields: [supplierReturns.supplierId],
      references: [suppliers.id],
    }),
    purchaseOrder: one(purchaseOrders, {
      fields: [supplierReturns.purchaseOrderId],
      references: [purchaseOrders.id],
    }),
    item: one(items, {
      fields: [supplierReturns.itemId],
      references: [items.id],
    }),
  }),
);

export const manufacturerReturnsRelations = relations(
  manufacturerReturns,
  ({ one }) => ({
    inspector: one(users, {
      fields: [manufacturerReturns.inspectorId],
      references: [users.id],
      relationName: 'inspector',
    }),
    approver: one(users, {
      fields: [manufacturerReturns.approvedBy],
      references: [users.id],
      relationName: 'approver',
    }),
    inspection: one(inspections, {
      fields: [manufacturerReturns.inspectionId],
      references: [inspections.id],
    }),
    manufacturer: one(manufacturers, {
      fields: [manufacturerReturns.manufacturerId],
      references: [manufacturers.id],
    }),
    manufacturingOrder: one(manufacturingOrders, {
      fields: [manufacturerReturns.manufacturingOrderId],
      references: [manufacturingOrders.id],
    }),
    item: one(items, {
      fields: [manufacturerReturns.itemId],
      references: [items.id],
    }),
  }),
);
