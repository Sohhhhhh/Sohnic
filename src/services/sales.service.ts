import {
  ISalesRepository,
  ISalesService,
  IItemsRepository,
  IInventoryRepository,
  ICustomersRepository,
  TX,
} from '../interfaces';
import { db } from '../config/drizzle';
import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { AuthenticatedUser } from '../types/app.types';
import { CreateSaleDto } from '../dtos/sales/createSale.dto';
import { CreateCustomerDto } from '../dtos/customers/createCustomer.dto';
import { FilterSalesDto } from '../dtos/sales/filterSales.dto';

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

  async findAll(
    user: AuthenticatedUser,
    page: number,
    limit: number,
    q: FilterSalesDto,
  ) {
    if (user.role.role === 'branch_admin') {
      if (q.branchId && q.branchId !== user.branchId)
        throw new APIError(
          'You can only view your own branch sales.',
          STATUS_CODES.Forbidden,
        );

      q.branchId = user.branchId;
    }

    const sales = await this.salesRepo.findAll(page, limit, q);

    return {
      statusCode: STATUS_CODES.OK,
      size: sales.length,
      data: sales,
    };
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const sale = await this.salesRepo.findSaleWithItems(id);

    if (!sale)
      throw new APIError('No sale found with this id.', STATUS_CODES.NotFound);

    if (user.role.role === 'branch_admin' && sale.branchId !== user.branchId)
      throw new APIError(
        'You can only view your own branch sales.',
        STATUS_CODES.Forbidden,
      );

    return { statusCode: STATUS_CODES.OK, data: sale };
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
    customer?: CreateCustomerDto,
    tx?: TX,
  ) {
    if (customerId) {
      const existing = await this.customersRepo.findById(customerId);
      if (!existing)
        throw new APIError(
          'No customer found with this id.',
          STATUS_CODES.NotFound,
        );
      return existing.id;
    }

    const existing = await this.customersRepo.findByPhone(customer!.phone);
    if (existing) return existing.id;

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
