import { IInventoryService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import {
  CombinedValidator,
  idValidatedCtrlr,
} from '../validators/common.validator';
import {
  filterInventoryValidatedCtrlr,
  stocktakeValidatedCtrlr,
} from '../validators/inventory.validator';

export class InventoryController {
  constructor(private readonly inventoryService: IInventoryService) {}

  findAll: filterInventoryValidatedCtrlr = async (req, res) => {
    const { page = 1, limit = 10, ...q } = req.query;
    const result: APIResponse = await this.inventoryService.findAll(
      +page,
      +limit,
      q,
    );
    sendResponse(res, result);
  };

  findOne: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.inventoryService.findOne(id);
    sendResponse(res, result);
  };

  adjust: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    const result: APIResponse = await this.inventoryService.adjust(
      user,
      id,
      req.body,
    );
    sendResponse(res, result);
  };

  stocktake: CombinedValidator<idValidatedCtrlr, stocktakeValidatedCtrlr> =
    async (req, res) => {
      const { id } = req.params;
      const { user } = req;

      const result: APIResponse = await this.inventoryService.stocktake(
        user,
        id,
        req.body,
      );
      sendResponse(res, result);
    };
}
