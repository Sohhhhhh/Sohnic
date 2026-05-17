import { IItemsService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { createItemValidatedCtrlr } from '../validators/items.validator';

export class ItemsController {
  constructor(private readonly itemsService: IItemsService) {}

  create: createItemValidatedCtrlr = async (req, res) => {
    const result: APIResponse = await this.itemsService.create(req.body);
    sendResponse(res, result);
  };
}
