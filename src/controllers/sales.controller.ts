import { sendResponse } from '../utils/sendResponse';
import { ISalesService } from '../interfaces/services';
import {
  createSaleValidatedCtrlr,
  filterSalesValidatedCtrlr,
} from '../validators/sales.validator';
import { idValidatedCtrlr } from '../validators/common.validator';
import { APIResponse } from '../types/api.types';

export class SalesController {
  constructor(private readonly salesService: ISalesService) {}

  create: createSaleValidatedCtrlr = async (req, res) => {
    const result = await this.salesService.create(req.user, req.body);
    sendResponse(res, result);
  };

  findAll: filterSalesValidatedCtrlr = async (req, res) => {
    const { page = 1, limit = 10, ...q } = req.query;
    const result: APIResponse = await this.salesService.findAll(
      req.user,
      +page,
      +limit,
      q,
    );
    sendResponse(res, result);
  };

  findOne: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.salesService.findOne(req.user, id);
    sendResponse(res, result);
  };
}
