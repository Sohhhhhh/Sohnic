import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import {
  createManufacturingOrderValidatedCtrlr,
  filterManufacturingOrderValidatedCtrlr,
} from '../validators/manufacturing-orders.validator';
import { IManufacturingOrdersService } from '../interfaces';
import { idValidatedCtrlr } from '../validators/common.validator';

export class ManufacturingOrdersController {
  constructor(
    private readonly manufacturingOrdersService: IManufacturingOrdersService,
  ) {}

  create: createManufacturingOrderValidatedCtrlr = async (req, res) => {
    const { id } = req.user;
    const result: APIResponse = await this.manufacturingOrdersService.create(
      id,
      req.body,
    );
    sendResponse(res, result);
  };

  findAll: filterManufacturingOrderValidatedCtrlr = async (req, res) => {
    const { page = 1, limit = 10, ...q } = req.query;
    const result: APIResponse = await this.manufacturingOrdersService.findAll(
      +page,
      +limit,
      q,
    );
    sendResponse(res, result);
  };

  findOne: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse =
      await this.manufacturingOrdersService.findOne(id);
    sendResponse(res, result);
  };
}
