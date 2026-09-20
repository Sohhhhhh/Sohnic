import { db } from '../config/drizzle';
import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { AuthenticatedUser } from '../types/app.types';
import {
  CreateCustomerData,
  CreateSaleDto,
} from '../dtos/sales/createSale.dto';
import {
  ISalesRepository,
  ISalesService,
  IItemsRepository,
  IInventoryRepository,
  ICustomersRepository,
  TX,
} from '../interfaces';

export class SalesService implements ISalesService {
  constructor(
    private readonly salesRepo: ISalesRepository,
    private readonly itemsRepo: IItemsRepository,
    private readonly inventoryRepo: IInventoryRepository,
    private readonly customersRepo: ICustomersRepository,
  ) {}

  async create(user: AuthenticatedUser, dto: CreateSaleDto) {
    const { branchId } = user;
    const { items, customerId, customer, ...saleData } = dto;
    const itemIds = items.map((i) => i.itemId);

    const [warehouse, foundItems] = await Promise.all([
      this.checkExistingWarehouse(branchId),
      this.checkExistingSellableItems(itemIds),
    ]);

    const priceMap = new Map(
      foundItems.map((item) => [item.id, item.salePrice ?? '0']),
    );
    const amount = items
      .reduce(
        (sum, i) =>
          sum + parseFloat(priceMap.get(i.itemId) ?? '0') * i.quantity,
        0,
      )
      .toFixed(2);

    const sale = await db.transaction(async (tx) => {
      const resolvedCustomerId = await this.resolveCustomer(
        customerId,
        customer,
        tx,
      );
      await this.checkStock(warehouse.id, items, tx);

      const newSale = await this.salesRepo.createSale(
        {
          ...saleData,
          branchId,
          cashierId: user.id,
          customerId: resolvedCustomerId,
          amount,
        },
        tx,
      );

      await Promise.all([
        this.salesRepo.createSaleItems(
          items.map((i) => ({
            orderId: newSale.id,
            itemId: i.itemId,
            quantity: i.quantity,
            unitPrice: priceMap.get(i.itemId) ?? '0',
          })),
          tx,
        ),
        this.inventoryRepo.deductStockBatchByWarehouse(
          warehouse.id,
          items.map((i) => ({ itemId: i.itemId, quantity: i.quantity })),
          tx,
        ),
      ]);

      return newSale;
    });

    return { statusCode: STATUS_CODES.Created, data: { ...sale, items } };
  }

  // --- Helpers ---

  private async checkExistingSellableItems(itemIds: string[]) {
    const foundItems = await this.itemsRepo.findSellableByIds(itemIds);
    if (foundItems.length !== itemIds.length)
      throw new APIError(
        'One or more items do not exist or are not sellable.',
        STATUS_CODES.BadRequest,
      );
    return foundItems;
  }

  private async checkExistingWarehouse(branchId: string) {
    const warehouse = await this.inventoryRepo.getWarehouseByBranchId(branchId);
    if (!warehouse)
      throw new APIError(
        'No warehouse found for your branch.',
        STATUS_CODES.NotFound,
      );
    return warehouse;
  }

  private async resolveCustomer(
    customerId?: string,
    customer?: CreateCustomerData,
    tx?: TX,
  ) {
    if (customerId) {
      const existing = await this.customersRepo.findById(customerId);
      if (!existing)
        throw new APIError('Customer not found.', STATUS_CODES.NotFound);
      return existing.id;
    }
    const newCustomer = await this.customersRepo.create(customer!, tx);
    return newCustomer.id;
  }

  private async checkStock(
    warehouseId: string,
    items: { itemId: string; quantity: number }[],
    tx?: TX,
  ) {
    const stockRecords = await this.inventoryRepo.findStockByWarehouse(
      warehouseId,
      items.map((i) => i.itemId),
      tx,
    );
    const stockMap = new Map(stockRecords.map((r) => [r.itemId, r.quantity]));
    const insufficient = items.filter(
      (i) => (stockMap.get(i.itemId) ?? 0) < i.quantity,
    );

    if (insufficient.length)
      throw new APIError(
        `Insufficient stock for item(s): ${insufficient.map((i) => i.itemId).join(', ')}`,
        STATUS_CODES.Conflict,
      );
  }
}
