import { IReturnsService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { createSuppRetValidatedCtrlr } from '../validators/returns.validator';

export class ReturnsController {
  constructor(private readonly returnsService: IReturnsService) {}

  createSupplierReturn: createSuppRetValidatedCtrlr = async (req, res) => {
    const result: APIResponse = await this.returnsService.createSupplierReturn(
      req.body,
    );

    sendResponse(res, result);
  };
}
