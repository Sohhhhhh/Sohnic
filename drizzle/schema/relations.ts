import { relations } from 'drizzle-orm';
import { users, roles, refreshTokens } from './users';
import { branches, warehouses } from './locations';
import { customers, orders, orderItems } from './customers';
import {
  sellableItems,
  rawMaterials,
  categories,
  billOfMaterials,
} from './products';
import {
  suppliers,
  rawMaterialSuppliers,
  sellableItemSuppliers,
  supplierQuotations,
  quotationItems,
} from './suppliers';
import {
  purchaseRequests,
  purchaseRequestItems,
  purchaseOrders,
  purchaseOrderItems,
} from './purchasing';
import { rawMaterialsInventory, sellableItemsInventory } from './inventory';
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
import { rawMaterialsInspection, itemsInspection } from './inspections';
import {
  returnRequests,
  rawMaterialReturns,
  finishedGoodsReturns,
} from './returns';

// Users Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  branch: one(branches, {
    fields: [users.branchId],
    references: [branches.id],
  }),
  refreshTokens: many(refreshTokens),
  ordersAsCashier: many(orders),
  purchaseRequestsAsOrderer: many(purchaseRequests, {
    relationName: 'orderer',
  }),
  purchaseRequestsAsReviewer: many(purchaseRequests, {
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
  rawMaterialInspections: many(rawMaterialsInspection),
  itemInspections: many(itemsInspection),
  returnRequestsAsInspector: many(returnRequests, {
    relationName: 'inspector',
  }),
  returnRequestsAsApprover: many(returnRequests, { relationName: 'approver' }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

// Branches Relations
export const branchesRelations = relations(branches, ({ one, many }) => ({
  manager: one(users, {
    fields: [branches.managerId],
    references: [users.id],
  }),
  users: many(users),
  warehouses: many(warehouses),
  orders: many(orders),
  purchaseRequests: many(purchaseRequests),
  transferRequestsRequested: many(transferRequests, {
    relationName: 'requestedBy',
  }),
  transferRequestsRequestedFrom: many(transferRequests, {
    relationName: 'requestedFrom',
  }),
}));

export const warehousesRelations = relations(warehouses, ({ one, many }) => ({
  branch: one(branches, {
    fields: [warehouses.branchId],
    references: [branches.id],
  }),
  rawMaterialsInventory: many(rawMaterialsInventory),
  sellableItemsInventory: many(sellableItemsInventory),
}));

// Customers Relations
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
  cashier: one(users, {
    fields: [orders.cashierId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  item: one(sellableItems, {
    fields: [orderItems.itemId],
    references: [sellableItems.id],
  }),
}));

// Products Relations
export const sellableItemsRelations = relations(
  sellableItems,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [sellableItems.categoryId],
      references: [categories.id],
    }),
    orderItems: many(orderItems),
    suppliers: many(sellableItemSuppliers),
    inventory: many(sellableItemsInventory),
    billOfMaterials: many(billOfMaterials),
    manufacturingOrders: many(manufacturingOrders),
    transferRequestItems: many(transferRequestItems),
    itemsInspections: many(itemsInspection),
  }),
);

export const rawMaterialsRelations = relations(rawMaterials, ({ many }) => ({
  suppliers: many(rawMaterialSuppliers),
  inventory: many(rawMaterialsInventory),
  billOfMaterials: many(billOfMaterials),
  quotationItems: many(quotationItems),
  purchaseRequestItems: many(purchaseRequestItems),
  purchaseOrderItems: many(purchaseOrderItems),
  inspections: many(rawMaterialsInspection),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parentCategory: one(categories, {
    fields: [categories.parentCategoryId],
    references: [categories.id],
    relationName: 'subcategories',
  }),
  subcategories: many(categories, { relationName: 'subcategories' }),
  items: many(sellableItems),
}));

export const billOfMaterialsRelations = relations(
  billOfMaterials,
  ({ one }) => ({
    item: one(sellableItems, {
      fields: [billOfMaterials.itemId],
      references: [sellableItems.id],
    }),
    rawMaterial: one(rawMaterials, {
      fields: [billOfMaterials.rawMaterialId],
      references: [rawMaterials.id],
    }),
  }),
);

// Suppliers Relations
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  rawMaterialSuppliers: many(rawMaterialSuppliers),
  sellableItemSuppliers: many(sellableItemSuppliers),
  quotations: many(supplierQuotations),
  purchaseOrders: many(purchaseOrders),
  rawMaterialReturns: many(rawMaterialReturns),
}));

export const rawMaterialSuppliersRelations = relations(
  rawMaterialSuppliers,
  ({ one }) => ({
    material: one(rawMaterials, {
      fields: [rawMaterialSuppliers.materialId],
      references: [rawMaterials.id],
    }),
    supplier: one(suppliers, {
      fields: [rawMaterialSuppliers.supplierId],
      references: [suppliers.id],
    }),
  }),
);

export const sellableItemSuppliersRelations = relations(
  sellableItemSuppliers,
  ({ one }) => ({
    item: one(sellableItems, {
      fields: [sellableItemSuppliers.itemId],
      references: [sellableItems.id],
    }),
    supplier: one(suppliers, {
      fields: [sellableItemSuppliers.supplierId],
      references: [suppliers.id],
    }),
  }),
);

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
  item: one(rawMaterials, {
    fields: [quotationItems.itemId],
    references: [rawMaterials.id],
  }),
}));

// Purchasing Relations
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
    material: one(rawMaterials, {
      fields: [purchaseRequestItems.materialId],
      references: [rawMaterials.id],
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
    inspections: many(rawMaterialsInspection),
    rawMaterialReturns: many(rawMaterialReturns),
  }),
);

export const purchaseOrderItemsRelations = relations(
  purchaseOrderItems,
  ({ one }) => ({
    order: one(purchaseOrders, {
      fields: [purchaseOrderItems.orderId],
      references: [purchaseOrders.id],
    }),
    item: one(rawMaterials, {
      fields: [purchaseOrderItems.itemId],
      references: [rawMaterials.id],
    }),
  }),
);

// Inventory Relations
export const rawMaterialsInventoryRelations = relations(
  rawMaterialsInventory,
  ({ one }) => ({
    rawMaterial: one(rawMaterials, {
      fields: [rawMaterialsInventory.rawMaterialId],
      references: [rawMaterials.id],
    }),
    warehouse: one(warehouses, {
      fields: [rawMaterialsInventory.warehouseId],
      references: [warehouses.id],
    }),
  }),
);

export const sellableItemsInventoryRelations = relations(
  sellableItemsInventory,
  ({ one }) => ({
    sellableItem: one(sellableItems, {
      fields: [sellableItemsInventory.sellableItemId],
      references: [sellableItems.id],
    }),
    warehouse: one(warehouses, {
      fields: [sellableItemsInventory.warehouseId],
      references: [warehouses.id],
    }),
  }),
);

// Manufacturing Relations
export const manufacturersRelations = relations(manufacturers, ({ many }) => ({
  manufacturingOrders: many(manufacturingOrders),
  finishedGoodsReturns: many(finishedGoodsReturns),
}));

export const manufacturingOrdersRelations = relations(
  manufacturingOrders,
  ({ one, many }) => ({
    product: one(sellableItems, {
      fields: [manufacturingOrders.productId],
      references: [sellableItems.id],
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
    finishedGoodsReturns: many(finishedGoodsReturns),
  }),
);

export const manufacturingBatchesRelations = relations(
  manufacturingBatches,
  ({ one, many }) => ({
    manufacturingOrder: one(manufacturingOrders, {
      fields: [manufacturingBatches.manufacturingOrderId],
      references: [manufacturingOrders.id],
    }),
    inspections: many(itemsInspection),
  }),
);

// Transfers Relations
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
    item: one(sellableItems, {
      fields: [transferRequestItems.itemId],
      references: [sellableItems.id],
    }),
    transferRequest: one(transferRequests, {
      fields: [transferRequestItems.transferRequestId],
      references: [transferRequests.id],
    }),
  }),
);

export const transferOrdersRelations = relations(transferOrders, ({ one }) => ({
  transferRequest: one(transferRequests, {
    fields: [transferOrders.transferRequestId],
    references: [transferRequests.id],
  }),
}));

// Inspections Relations
export const rawMaterialsInspectionRelations = relations(
  rawMaterialsInspection,
  ({ one, many }) => ({
    order: one(purchaseOrders, {
      fields: [rawMaterialsInspection.orderId],
      references: [purchaseOrders.id],
    }),
    item: one(rawMaterials, {
      fields: [rawMaterialsInspection.itemId],
      references: [rawMaterials.id],
    }),
    inspector: one(users, {
      fields: [rawMaterialsInspection.inspectorId],
      references: [users.id],
    }),
    rawMaterialReturns: many(rawMaterialReturns),
  }),
);

export const itemsInspectionRelations = relations(
  itemsInspection,
  ({ one, many }) => ({
    manufacturingBatch: one(manufacturingBatches, {
      fields: [itemsInspection.manufacturingBatchId],
      references: [manufacturingBatches.id],
    }),
    item: one(sellableItems, {
      fields: [itemsInspection.itemId],
      references: [sellableItems.id],
    }),
    inspector: one(users, {
      fields: [itemsInspection.inspectorId],
      references: [users.id],
    }),
    finishedGoodsReturns: many(finishedGoodsReturns),
  }),
);

// Returns Relations
export const returnRequestsRelations = relations(
  returnRequests,
  ({ one, many }) => ({
    inspector: one(users, {
      fields: [returnRequests.inspectorId],
      references: [users.id],
      relationName: 'inspector',
    }),
    approver: one(users, {
      fields: [returnRequests.approvedBy],
      references: [users.id],
      relationName: 'approver',
    }),
    rawMaterialReturn: many(rawMaterialReturns),
    finishedGoodsReturn: many(finishedGoodsReturns),
  }),
);

export const rawMaterialReturnsRelations = relations(
  rawMaterialReturns,
  ({ one }) => ({
    returnRequest: one(returnRequests, {
      fields: [rawMaterialReturns.returnRequestId],
      references: [returnRequests.id],
    }),
    rawMaterialInspection: one(rawMaterialsInspection, {
      fields: [rawMaterialReturns.rawMaterialInspectionId],
      references: [rawMaterialsInspection.id],
    }),
    supplier: one(suppliers, {
      fields: [rawMaterialReturns.supplierId],
      references: [suppliers.id],
    }),
    purchaseOrder: one(purchaseOrders, {
      fields: [rawMaterialReturns.purchaseOrderId],
      references: [purchaseOrders.id],
    }),
  }),
);

export const finishedGoodsReturnsRelations = relations(
  finishedGoodsReturns,
  ({ one }) => ({
    returnRequest: one(returnRequests, {
      fields: [finishedGoodsReturns.returnRequestId],
      references: [returnRequests.id],
    }),
    finishedGoodsInspection: one(itemsInspection, {
      fields: [finishedGoodsReturns.finishedGoodsInspectionId],
      references: [itemsInspection.id],
    }),
    manufacturer: one(manufacturers, {
      fields: [finishedGoodsReturns.manufacturerId],
      references: [manufacturers.id],
    }),
    manufacturingOrder: one(manufacturingOrders, {
      fields: [finishedGoodsReturns.manufacturingOrderId],
      references: [manufacturingOrders.id],
    }),
  }),
);
