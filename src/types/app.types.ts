import {
  categories,
  items,
  itemSuppliers,
  purchaseRequests,
  roles,
  supplierQuotations,
  suppliers,
  users,
  purchaseOrders,
  inspections,
  supplierReturns,
  manufacturers,
  manufacturingOrders,
} from '../../drizzle/schema';

export type BomLine = {
  componentId: string;
  quantityPerUnit: number;
  name: string;
  sku: string;
  type: string;
  sellableType: string | null;
  unitOfMeasurement: string | null;
};

export type PurchaseOrderItem = {
  itemId: string;
  quantity: number;
  unitPrice: string;
};

export type User = typeof users.$inferSelect;
export type SafeUser = Omit<User, 'password'>;
export type Role = typeof roles.$inferSelect;
export type AuthenticatedUser = SafeUser & { role: Role };
export type Supplier = typeof suppliers.$inferSelect;
export type ItemSupplier = typeof itemSuppliers.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Item = typeof items.$inferSelect;
export type PurchaseRequest = typeof purchaseRequests.$inferSelect;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type PurchaseOrderWithItems = PurchaseOrder & {
  items: PurchaseOrderItem[];
};
export type SupplierQuotation = typeof supplierQuotations.$inferSelect;
export type Inspection = typeof inspections.$inferSelect;
export type SupplierReturn = typeof supplierReturns.$inferSelect;
export type Manufacturer = typeof manufacturers.$inferSelect;
export type ManufacturingOrder = typeof manufacturingOrders.$inferSelect;
