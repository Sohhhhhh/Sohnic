import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { APIResponse } from '../types/api.types';
import { IInventoryRepository, IInventoryService, TX } from '../interfaces';
import { AdjustStockDto } from '../dtos/inventory/adjustStock.dto';
import { FilterInventoryDto } from '../dtos/inventory/filterInventory.dto';

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

  async adjust(id: string, dto: AdjustStockDto): Promise<APIResponse> {
    const record = await this.checkExistingInventory(id);

    const newQuantity = record.quantity + dto.quantity;
    if (newQuantity < 0)
      throw new APIError(
        `Insufficient stock. Current quantity is ${record.quantity}.`,
        STATUS_CODES.Conflict,
      );

    const updated = await this.inventoryRepo.adjust(id, newQuantity);
    return { statusCode: STATUS_CODES.OK, data: updated };
  }

  async findByMaterialIds(materialIds: string[]) {
    return this.inventoryRepo.findByMaterialIds(materialIds);
  }

  async deductStockBatch(
    materials: { materialId: string; quantity: number }[],
    tx?: any,
  ) {
    return this.inventoryRepo.deductStockBatch(materials, tx);
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
