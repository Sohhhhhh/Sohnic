import { QueryResult } from 'pg';
import { NodePgTransaction } from 'drizzle-orm/node-postgres';

import {
  Category,
  Item,
  ItemSupplier,
  Role,
  SafeUser,
  Supplier,
  User,
  BomLine,
  PurchaseRequest,
  SupplierQuotation,
  PurchaseOrder,
  Inspection,
  PurchaseOrderWithItems,
  Manufacturer,
  ManufacturingOrder,
  ManufacturingBatch,
  Inventory,
  Warehouse,
  TransferRequest,
  TransferRequestItem,
  TransferRequestWithItems,
  Sale,
  SaleItem,
  Customer,
  SaleWithData,
  Return,
} from '../types/app.types';
import {
  CreateSaleData,
  CreateSaleItemData,
} from '../dtos/sales/createSale.dto';
import {
  AddBomComponentDto,
  UpdateBomComponentDto,
} from '../dtos/items/bom.dto';
import { db } from '../config/drizzle';
import {
  CreatePurchaseOrderData,
  CreatePurchaseOrderItemData,
} from '../dtos/purchasing/createPurchaseOrder.dto';
import {
  CreateTransferRequestData,
  CreateTransferRequestItemData,
} from '../dtos/transfers/createTransferRequest.dto';
import {
  CreatePurchaseRequestData,
  CreatePurchaseRequestItemData,
} from '../dtos/purchasing/createPurchaseRequest.dto';
import {
  CreateSupplierQuotationData,
  CreateSupplierQuotationItemData,
} from '../dtos/purchasing/createSupplierQuotation.dto';
import { CreateUserDto } from '../dtos/users/createUser.dto';
import { CreateItemDto } from '../dtos/items/createItem.dto';
import { UpdateItemDto } from '../dtos/items/updateItem.dto';
import { FilterItemsDto } from '../dtos/items/filterItems.dto';
import { FilterSalesDto } from '../dtos/sales/filterSales.dto';
import { CreateReturnData } from '../dtos/returns/createReturn.dto';
import { FilterReturnsDto } from '../dtos/returns/filterReturns.dto';
import { CreateSupplierDto } from '../dtos/suppliers/createSupplier.dto';
import { UpdateSupplierDto } from '../dtos/suppliers/updateSupplier.dto';
import { CreateCustomerDto } from '../dtos/customers/createCustomer.dto';
import { UpdateCustomerDto } from '../dtos/customers/updateCustomer.dto';
import { UpdateCategoryDto } from '../dtos/categories/updateCategory.dto';
import { CreateCategoryDto } from '../dtos/categories/createCategory.dto';
import { AddItemSupplierDto } from '../dtos/suppliers/addItemSupplier.dto';
import { FilterSuppliersDto } from '../dtos/suppliers/filterSuppliers.dto';
import { FilterInventoryDto } from '../dtos/inventory/filterInventory.dto';
import { EditItemSupplierDto } from '../dtos/suppliers/editItemSupplier.dto';
import { CreateInspectionData } from '../dtos/inspections/createInspection.dto';
import { FilterInspectionsDto } from '../dtos/inspections/filterInspections.dto';
import { FilterItemSuppliersDto } from '../dtos/suppliers/filterItemSuppliers.dto';
import { CreateManufacturerDto } from '../dtos/manufacturers/createManufacturer.dto';
import { UpdateManufacturerDto } from '../dtos/manufacturers/updateManufacturer.dto';
import { FilterPurchaseOrdersDto } from '../dtos/purchasing/filterPurchaseOrders.dto';
import { FilterManufacturersDto } from '../dtos/manufacturers/filterManufacturers.dto';
import { FilterTransferRequestsDto } from '../dtos/transfers/filterTransferRequests.dto';
import { FilterPurchaseRequestsDto } from '../dtos/purchasing/filterPurchaseRequests.dto';
import { SupplierQuotationsRepository } from '../repositories/supplier-quotations.repository';
import { UpdatePurchaseRequestStatusData } from '../dtos/purchasing/rejectPurchaseRequest.dto';
import { CreateManufacturingOrderData } from '../dtos/manufacturing-orders/createManufacturingOrder.dto';
import { CreateManufacturingBatchData } from '../dtos/manufacturing-batches/createManufacturingBatch.dto';
import { FilterManufacturingOrdersDto } from '../dtos/manufacturing-orders/filterManufacturingOrder.dto';

// ----- Record Types -----

export interface RefreshTokenRecord {
  token: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface SetPasswordTokenRecord {
  token: string;
  userId: string;
  expiresAt: Date;
}

export type TX = typeof db | NodePgTransaction<any, any>;

// ----- Repository Interfaces -----

export interface IUsersRepository {
  createUser(dto: CreateUserDto, tx?: any): Promise<SafeUser>;
  updateUserPassword(
    userId: string,
    password: string,
    tx?: TX,
  ): Promise<SafeUser>;
  getUserByUsername(username: string): Promise<SafeUser | undefined>;
  getUserByEmail(email: string): Promise<SafeUser | undefined>;
  getUserByPhone(phone: string): Promise<SafeUser | undefined>;
  getUserById(id: string): Promise<SafeUser | undefined>;
  getUserWithPassword(usernameOrEmail: string): Promise<User | undefined>;
  findAll(branchId?: string): Promise<SafeUser[]>;
  updateBranch(userId: string, branchId: string): Promise<SafeUser>;
  updateRole(userId: string, branchId: string): Promise<SafeUser>;
  updateIsActive(userId: string, isActive: boolean): Promise<SafeUser>;
}

export interface IRefreshTokensRepository {
  create(token: string, userId: string, tx?: TX): Promise<void>;
  getByUserAndHash(
    userId: string,
    hashedToken: string,
    tx?: TX,
  ): Promise<RefreshTokenRecord | undefined>;
  revokeByUserId(userId: string, reason?: string, tx?: TX): Promise<void>;
  revokeByHash(token: string, reason?: string, tx?: TX): Promise<void>;
}
export interface ISetPasswordTokensRepository {
  create(token: string, userId: string, tx?: TX): Promise<void>;
  getByToken(token: string, tx?: TX): Promise<SetPasswordTokenRecord | null>;
  deleteByUserId(userId: string, tx?: TX): Promise<void>;
}

export interface IRolesRepository {
  getById(id: string): Promise<Role | undefined>;
}

export interface IBranchesRepository {
  getById(id: string): Promise<Record<string, unknown> | undefined>;
  getMainBranchId(): Promise<string>;
}

export interface ISuppliersRepository {
  create(dto: CreateSupplierDto): Promise<Supplier>;
  getSupplierByEmail(email: string): Promise<Supplier | undefined>;
  findAll(q?: FilterSuppliersDto): Promise<Supplier[]>;
  findOne(id: string): Promise<Supplier | undefined>;
  update(id: string, dto: UpdateSupplierDto): Promise<Supplier>;
  deactivate(id: string): Promise<Supplier>;
  activate(id: string): Promise<Supplier>;
}

export interface IItemSuppliersRepository {
  addItemSupplier(
    dto: AddItemSupplierDto,
    supplierId: string,
  ): Promise<ItemSupplier>;
  findOne(
    supplierId: string,
    itemId: string,
  ): Promise<ItemSupplier | undefined>;
  findOneById(id: string): Promise<ItemSupplier | undefined>;
  editItemSupplier(id: string, dto: EditItemSupplierDto): Promise<ItemSupplier>;
  deleteItemSupplier(id: string, tx?: TX): Promise<QueryResult<never>>;
  deleteByItemId(itemId: string, tx?: TX): Promise<void>;
  getAllItemsSuppliers(
    page: number,
    limit: number,
    q?: FilterItemSuppliersDto,
  ): Promise<ItemSupplier[]>;
  getItemSuppliers(
    itemId: string,
    page: number,
    limit: number,
    q?: FilterItemSuppliersDto,
  ): Promise<ItemSupplier[]>;
  makePrimary(id: string, tx?: TX): Promise<ItemSupplier>;
  removePrimary(itemId: string, tx?: TX): Promise<ItemSupplier>;
  removePrimaryById(id: string): Promise<ItemSupplier>;
  findManyBySupplierAndItems(
    supplierId: string,
    itemIds: string[],
  ): Promise<ItemSupplier[]>;
}

export interface ICategoriesRepository {
  create(dto: CreateCategoryDto): Promise<Category>;
  findOne(id: string): Promise<Category | undefined>;
  update(id: string, dto: UpdateCategoryDto): Promise<Category>;
  delete(id: string): Promise<void>;
  getParentCategories(): Promise<Category[]>;
  getChildCategories(id: string): Promise<Category[]>;
}

export interface IItemsRepository {
  create(dto: CreateItemDto): Promise<Item>;
  findAll(page: number, limit: number, q?: FilterItemsDto): Promise<Item[]>;
  findOne(id: string): Promise<Item | undefined>;
  update(id: string, dto: UpdateItemDto): Promise<Item>;
  delete(id: string, tx?: TX): Promise<void>;
  findManyByIds(ids: string[]): Promise<Item[]>;
  findSellableByIds(ids: string[]): Promise<Item[]>;
}

export interface IBomRepository {
  addComponent(itemId: string, dto: AddBomComponentDto): Promise<void>;
  getBomByItemId(itemId: string): Promise<BomLine[]>;
  checkIfExists(itemId: string, componentId: string): Promise<boolean>;
  updateComponent(
    itemId: string,
    componentId: string,
    dto: UpdateBomComponentDto,
  ): Promise<void>;
  removeComponent(itemId: string, componentId: string): Promise<void>;
  deleteByItemOrComponentId(id: string, tx?: TX): Promise<void>;
}

export interface IPurchaseRequestsRepository {
  createReq(dto: CreatePurchaseRequestData, tx?: TX): Promise<PurchaseRequest>;
  createManyItems(dto: CreatePurchaseRequestItemData[], tx?: TX): Promise<void>;
  getAllPurchaseRequests(
    page: number,
    limit: number,
    q?: FilterPurchaseRequestsDto,
  ): Promise<PurchaseRequest[]>;
  findReq(id: string): Promise<PurchaseRequest | undefined>;
  updateReqStatus(
    id: string,
    data: UpdatePurchaseRequestStatusData,
  ): Promise<PurchaseRequest>;
}

export interface ISupplierQuotationsRepository {
  createQuotation(
    dto: CreateSupplierQuotationData,
    tx?: TX,
  ): Promise<SupplierQuotation>;

  createManyItems(
    dto: CreateSupplierQuotationItemData[],
    tx?: TX,
  ): Promise<void>;

  getPurchReqQuotations(
    id: string,
    page: number,
    limit: number,
  ): Promise<SupplierQuotation[]>;

  getQuotation(
    id: string,
  ): Promise<Awaited<ReturnType<SupplierQuotationsRepository['getQuotation']>>>;
}

export interface IPurchaseOrdersRepository {
  createOrder(dto: CreatePurchaseOrderData, tx?: TX): Promise<PurchaseOrder>;
  createManyItems(dto: CreatePurchaseOrderItemData[], tx?: TX): Promise<void>;
  getAllOrders(
    page: number,
    limit: number,
    q?: FilterPurchaseOrdersDto,
  ): Promise<PurchaseOrder[]>;
  getOrder(id: string): Promise<PurchaseOrderWithItems | undefined>;
  getOrderByQuotationId(id: string): Promise<PurchaseOrder | undefined>;
  updateOrder(
    id: string,
    data: Partial<PurchaseOrder>,
    tx?: TX,
  ): Promise<PurchaseOrder>;
}

export interface IInspectionsRepository {
  create(dto: CreateInspectionData): Promise<Inspection>;
  getOne(id: string): Promise<Inspection | undefined>;
  getAll(
    page: number,
    limit: number,
    q?: FilterInspectionsDto,
  ): Promise<Inspection[]>;
  findPassedByTransferRequest(requestId: string): Promise<Inspection[]>;
  findPassedByManufacturingBatch(
    batchId: string,
  ): Promise<Inspection | undefined>;
}

export interface IReturnsRepository {
  create(dto: CreateReturnData): Promise<Return>;
  findAll(page: number, limit: number, q?: FilterReturnsDto): Promise<Return[]>;
  findOne(id: string): Promise<Return | undefined>;
  updateOne(id: string, data: Partial<Return>): Promise<Return>;
}

export interface IManufacturersRepository {
  create(dto: CreateManufacturerDto): Promise<Manufacturer>;
  findOneByEmail(email: string): Promise<Manufacturer | undefined>;
  findAll(
    page: number,
    limit: number,
    q?: FilterManufacturersDto,
  ): Promise<Manufacturer[]>;
  findOne(id: string): Promise<Manufacturer | undefined>;
  update(id: string, dto: UpdateManufacturerDto): Promise<Manufacturer>;
}

export interface IManufacturingOrdersRepository {
  create(data: CreateManufacturingOrderData): Promise<ManufacturingOrder>;
  createWithMaterials(
    dto: CreateManufacturingOrderData,
    materials: { materialId: string; quantity: number; unitCost: string }[],
  ): Promise<ManufacturingOrder>;
  findAll(
    page: number,
    limit: number,
    q?: FilterManufacturingOrdersDto,
  ): Promise<ManufacturingOrder[]>;
  findOne(id: string): Promise<ManufacturingOrder | undefined>;
  findOrderMaterials(
    orderId: string,
  ): Promise<{ materialId: string; quantity: number }[]>;
  updateOrder(
    id: string,
    data: Partial<ManufacturingOrder>,
  ): Promise<ManufacturingOrder>;
}

export interface IManufacturingBatchesRepository {
  create(data: CreateManufacturingBatchData): Promise<ManufacturingBatch>;
  findByOrder(
    orderId: string,
    page: number,
    limit: number,
  ): Promise<ManufacturingBatch[]>;
  findOne(id: string): Promise<
    | (ManufacturingBatch & {
        manufacturingOrder: { productId: string };
      })
    | undefined
  >;
}

export interface IInventoryRepository {
  getMainWarehouseId(): Promise<string>;
  findAll(
    page: number,
    limit: number,
    q?: FilterInventoryDto,
  ): Promise<(Inventory & { item: Item; warehouse: Warehouse })[]>;
  findOne(id: string): Promise<Inventory | undefined>;
  adjust(id: string, newQuantity: number): Promise<Inventory>;
  findByItemIds(itemIds: string[]): Promise<Inventory[]>;
  deductMainWarehouseStockBatch(
    items: { itemId: string; quantity: number }[],
    tx?: TX,
  ): Promise<void>;
  deductStockBatchByWarehouse(
    warehouseId: string,
    items: { itemId: string; quantity: number }[],
    tx?: TX,
  ): Promise<void>;
  addStock(itemId: string, quantity: number): Promise<Inventory>;
  findStockByWarehouse(
    warehouseId: string,
    itemIds: string[],
    tx?: TX,
  ): Promise<{ itemId: string; quantity: number }[]>;
  getWarehouseByBranchId(branchId: string): Promise<Warehouse>;
  upsert(
    itemId: string,
    warehouseId: string,
    quantity: number,
    tx?: TX,
  ): Promise<Inventory>;
  stocktake(
    id: string,
    data: { quantity: number; lastStocktakeDate: string },
  ): Promise<Inventory>;
}

export interface ITransfersRepository {
  create(dto: CreateTransferRequestData, tx?: TX): Promise<TransferRequest>;
  createManyItems(dto: CreateTransferRequestItemData[], tx?: TX): Promise<void>;
  findAll(
    page: number,
    limit: number,
    q?: FilterTransferRequestsDto,
  ): Promise<TransferRequestWithItems[]>;
  findOne(id: string): Promise<TransferRequestWithItems | undefined>;
  updateRequest(
    id: string,
    data: Partial<TransferRequest>,
    tx?: TX,
  ): Promise<TransferRequest>;
  updateRequestItem(
    transferRequestId: string,
    itemId: string,
    data: Partial<TransferRequestItem>,
    tx?: TX,
  ): Promise<TransferRequestItem>;
}

export interface ISalesRepository {
  createSale(data: CreateSaleData, tx?: TX): Promise<Sale>;
  createSaleItems(items: CreateSaleItemData[], tx?: TX): Promise<SaleItem[]>;
  findSaleWithItems(id: string): Promise<SaleWithData | undefined>;
  findAll(
    page: number,
    limit: number,
    q?: FilterSalesDto,
  ): Promise<SaleWithData[]>;
}

export interface ICustomersRepository {
  findById(id: string): Promise<Customer | undefined>;
  findByPhone(phone: string): Promise<Customer | undefined>;
  create(data: CreateCustomerDto, tx?: TX): Promise<Customer>;
  update(id: string, data: UpdateCustomerDto): Promise<Customer>;
}
