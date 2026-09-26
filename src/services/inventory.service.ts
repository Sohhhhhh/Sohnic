import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { APIResponse } from '../types/api.types';
import { IInventoryRepository, IInventoryService, TX } from '../interfaces';
import { AdjustStockDto } from '../dtos/inventory/adjustStock.dto';
import { FilterInventoryDto } from '../dtos/inventory/filterInventory.dto';
import { AuthenticatedUser } from '../types/app.types';
import { StocktakeDto } from '../dtos/inventory/stocktake.dto';

export class InventoryService implements IInventoryService {
  constructor(private readonly inventoryRepo: IInventoryRepository) {}

  async findAll(page: number, limit: number, q?: FilterInventoryDto) {
    const data = await this.inventoryRepo.findAll(page, limit, q);
    return { statusCode: STATUS_CODES.OK, size: data.length, data };
  }

  async findOne(id: string): Promise<APIResponse> {
    const record = await this.checkExistingInventory(id);
    return { statusCode: STATUS_CODES.OK, data: record };
  }

  async adjust(
    user: AuthenticatedUser,
    id: string,
    dto: AdjustStockDto,
  ): Promise<APIResponse> {
    const record = await this.checkExistingInventory(id);

    if (user.role.role === 'storage_manager') {
      const warehouse = await this.inventoryRepo.getWarehouseByBranchId(
        user.branchId,
      );
      if (record.warehouseId !== warehouse.id)
        throw new APIError(
          'You can only adjust inventory in your own branch',
          STATUS_CODES.Forbidden,
        );
    }

    const newQuantity = record.quantity + dto.quantity;
    if (newQuantity < 0)
      throw new APIError(
        `Insufficient stock. Current quantity is ${record.quantity}.`,
        STATUS_CODES.Conflict,
      );

    const updated = await this.inventoryRepo.adjust(id, newQuantity);
    return { statusCode: STATUS_CODES.OK, data: updated };
  }

  async stocktake(
    user: AuthenticatedUser,
    id: string,
    dto: StocktakeDto,
  ): Promise<APIResponse> {
    const record = await this.checkExistingInventory(id);

    if (user.role.role === 'storage_manager') {
      const warehouse = await this.inventoryRepo.getWarehouseByBranchId(
        user.branchId,
      );
      if (record.warehouseId !== warehouse.id)
        throw new APIError(
          'You can only stocktake inventory in your own branch',
          STATUS_CODES.Forbidden,
        );
    }

    const updated = await this.inventoryRepo.stocktake(id, {
      quantity: dto.actualQuantity,
      lastStocktakeDate: new Date().toISOString().split('T')[0],
    });
    return { statusCode: STATUS_CODES.OK, data: updated };
  }

  async findByItemIds(itemIds: string[]) {
    return this.inventoryRepo.findByItemIds(itemIds);
  }

  async deductMainWarehouseStockBatch(
    items: { itemId: string; quantity: number }[],
    tx?: any,
  ) {
    return this.inventoryRepo.deductMainWarehouseStockBatch(items, tx);
  }

  async addStock(itemId: string, quantity: number) {
    return this.inventoryRepo.addStock(itemId, quantity);
  }

  async upsert(itemId: string, warehouseId: string, quantity: number, tx?: TX) {
    return this.inventoryRepo.upsert(itemId, warehouseId, quantity, tx);
  }

  // --- Helpers ---
  private async checkExistingInventory(id: string) {
    const record = await this.inventoryRepo.findOne(id);
    if (!record)
      throw new APIError(
        'No inventory record found with this id',
        STATUS_CODES.NotFound,
      );
    return record;
  }
}
