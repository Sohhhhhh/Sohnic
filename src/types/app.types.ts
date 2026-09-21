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
  inventory,
  warehouses,
  transferRequests,
  transferRequestItems,
  orders,
  orderItems,
  customers,
} from '../../drizzle/schema';

export type BomLine = {
  componentId: string;
  quantityPerUnit: number;
  name: string;
  sku: string;
  type: 'sellable_item' | 'raw_material';
  sellableType: 'finished' | 'resale' | null;
  unitOfMeasurement: string | null;
  standardPrice: string | null;
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
export type Inventory = typeof inventory.$inferSelect;
export type Warehouse = typeof warehouses.$inferSelect;
export type TransferRequest = typeof transferRequests.$inferSelect;
export type TransferRequestItem = typeof transferRequestItems.$inferSelect;
export type TransferRequestWithItems = TransferRequest & {
  items: TransferRequestItem[];
};
export type Sale = typeof orders.$inferSelect;
export type SaleItem = typeof orderItems.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type SaleWithData = Sale & {
  items: SaleItem[];
  customer: Customer;
};
