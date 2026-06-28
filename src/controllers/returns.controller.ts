import { IReturnsService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { idValidatedCtrlr } from '../validators/common.validator';
import { createSuppRetValidatedCtrlr } from '../validators/returns.validator';
import { filterSuppRetsValidatedCtrlr } from '../validators/returns.validator';

export class ReturnsController {
  constructor(private readonly returnsService: IReturnsService) {}

  createSupplierReturn: createSuppRetValidatedCtrlr = async (req, res) => {
    const result: APIResponse = await this.returnsService.createSupplierReturn(
      req.body,
    );

    sendResponse(res, result);
  };

  getAllSupplierReturns: filterSuppRetsValidatedCtrlr = async (req, res) => {
    const { page, limit, ...q } = req.query;
    const result: APIResponse = await this.returnsService.getAllSupplierReturns(
      +page,
      +limit,
      q,
    );

    sendResponse(res, result);
  };

  getOneSupplierReturn: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse =
      await this.returnsService.getOneSupplierReturn(id);

    sendResponse(res, result);
  };
}
