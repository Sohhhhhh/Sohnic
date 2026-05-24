import {
  categories,
  items,
  itemSuppliers,
  purchaseRequests,
  roles,
  supplierQuotations,
  suppliers,
  users,
} from '../../drizzle/schema';

export type User = typeof users.$inferSelect;
export type SafeUser = Omit<User, 'password'>;
export type Role = typeof roles.$inferSelect;
export type AuthenticatedUser = SafeUser & { role: Role };
export type Supplier = typeof suppliers.$inferSelect;
export type ItemSupplier = typeof itemSuppliers.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Item = typeof items.$inferSelect;
export type PurchaseRequest = typeof purchaseRequests.$inferSelect;
export type SupplierQuotation = typeof supplierQuotations.$inferSelect;
export type BomLine = {
  componentId: string;
  quantityPerUnit: number;
  name: string;
  sku: string;
  type: string;
  sellableType: string | null;
  unitOfMeasurement: string | null;
};
