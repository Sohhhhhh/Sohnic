import {
  createPurchaseRequestValidatedCtrlr,
  filterPurchaseRequestsValidatedCtrlr,
} from '../validators/purchasing.validator';
import { APIResponse } from '../types/api.types';
import { IPurchasingService } from '../interfaces';
import { sendResponse } from '../utils/sendResponse';

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

  getAllPurchaseRequests: filterPurchaseRequestsValidatedCtrlr = async (
    req,
    res,
  ) => {
    const { page, limit, ...q } = req.query;
    const { user } = req;
    const result: APIResponse =
      await this.purchasingService.getAllPurchaseRequests(
        user,
        +page,
        +limit,
        q,
      );
    sendResponse(res, result);
  };
}
