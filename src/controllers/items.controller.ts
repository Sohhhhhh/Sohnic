import { IItemsService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { idValidatedCtrlr } from '../validators/common.validator';
import { createItemValidatedCtrlr } from '../validators/items.validator';

export class ItemsController {
  constructor(private readonly itemsService: IItemsService) {}

  create: createItemValidatedCtrlr = async (req, res) => {
    const result: APIResponse = await this.itemsService.create(req.body);
    sendResponse(res, result);
  };

  delete: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.itemsService.delete(id);
    sendResponse(res, result);
  };
}
