import { APIResponse } from '../types/api.types';
import { IPurchasingService } from '../interfaces';
import { sendResponse } from '../utils/sendResponse';
import { createPurchaseRequestValidatedCtrlr } from '../validators/purchasing.validator';

export class PurchasingController {
  constructor(private readonly purchasingService: IPurchasingService) {}

  createPurchaseRequest: createPurchaseRequestValidatedCtrlr = async (
    req,
    res,
  ) => {
    const { id } = req.user;
    const result: APIResponse =
      await this.purchasingService.createPurchaseRequest(id, req.body);
    sendResponse(res, result);
  };
}
