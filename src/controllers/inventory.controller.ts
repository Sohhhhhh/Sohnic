import { RequestHandler } from 'express';
import { IInventoryService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { FilterInventoryDto } from '../dtos/inventory/filterInventory.dto';

export class InventoryController {
  constructor(private readonly inventoryService: IInventoryService) {}

  findAll: RequestHandler = async (req, res) => {
    const { page = 1, limit = 10, ...q } = req.query;
    const result: APIResponse = await this.inventoryService.findAll(
      +page,
      +limit,
      q as FilterInventoryDto,
    );
    sendResponse(res, result);
  };

  findOne: RequestHandler<{ id: string }> = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.inventoryService.findOne(id);
    sendResponse(res, result);
  };

  adjust: RequestHandler<{ id: string }> = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.inventoryService.adjust(
      id,
      req.body,
    );
    sendResponse(res, result);
  };
}
