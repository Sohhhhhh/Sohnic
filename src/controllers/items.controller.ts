import { IItemsService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import {
  CombinedValidator,
  idAndItemIdValidatedCtrlr,
  idValidatedCtrlr,
} from '../validators/common.validator';
import {
  createItemValidatedCtrlr,
  updateItemValidatedCtrlr,
  filterItemsValidatedCtrlr,
  addBomComponentValidatedCtrlr,
  updateBomComponentValidatedCtrlr,
} from '../validators/items.validator';

export class ItemsController {
  constructor(private readonly itemsService: IItemsService) {}

  create: createItemValidatedCtrlr = async (req, res) => {
    const result: APIResponse = await this.itemsService.create(req.body);
    sendResponse(res, result);
  };

  findAll: filterItemsValidatedCtrlr = async (req, res) => {
    const { page, limit, ...q } = req.query;
    const result: APIResponse = await this.itemsService.findAll(
      +page,
      +limit,
      q,
    );
    sendResponse(res, result);
  };

  findOne: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.itemsService.findOne(id);
    sendResponse(res, result);
  };

  update: CombinedValidator<idValidatedCtrlr, updateItemValidatedCtrlr> =
    async (req, res) => {
      const { id } = req.params;
      const result: APIResponse = await this.itemsService.update(id, req.body);
      sendResponse(res, result);
    };

  delete: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.itemsService.delete(id);
    sendResponse(res, result);
  };

  // ---- BOM ----

  addBomComponent: CombinedValidator<
    idValidatedCtrlr,
    addBomComponentValidatedCtrlr
  > = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.itemsService.addBomComponent(
      id,
      req.body,
    );
    sendResponse(res, result);
  };

  getBom: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.itemsService.getBom(id);
    sendResponse(res, result);
  };

  updateBomComponent: CombinedValidator<
    idAndItemIdValidatedCtrlr,
    updateBomComponentValidatedCtrlr
  > = async (req, res) => {
    const { id, itemId } = req.params;
    const result: APIResponse = await this.itemsService.updateBomComponent(
      id,
      itemId,
      req.body,
    );
    sendResponse(res, result);
  };

  removeBomComponent: idAndItemIdValidatedCtrlr = async (req, res) => {
    const { id, itemId } = req.params;
    const result: APIResponse = await this.itemsService.removeBomComponent(
      id,
      itemId,
    );
    sendResponse(res, result);
  };
}
