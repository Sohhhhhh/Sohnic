import {
  CombinedValidator,
  idValidatedCtrlr,
  paginationValidatedCtrlr,
} from '../validators/common.validator';
import {
  rejectPurchaseRequestValidatedCtrlr,
  createPurchaseRequestValidatedCtrlr,
  filterPurchaseRequestsValidatedCtrlr,
  createSupplierQuotationValidatedCtrlr,
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

  getPurchaseRequest: idValidatedCtrlr = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const result: APIResponse = await this.purchasingService.getPurchaseRequest(
      user,
      id,
    );
    sendResponse(res, result);
  };

  approvePurchaseRequest: idValidatedCtrlr = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const result: APIResponse =
      await this.purchasingService.approvePurchaseRequest(user, id);
    sendResponse(res, result);
  };

  rejectPurchaseRequest: CombinedValidator<
    idValidatedCtrlr,
    rejectPurchaseRequestValidatedCtrlr
  > = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const result: APIResponse =
      await this.purchasingService.rejectPurchaseRequest(user, id, req.body);
    sendResponse(res, result);
  };

  createSupplierQuotation: CombinedValidator<
    idValidatedCtrlr,
    createSupplierQuotationValidatedCtrlr
  > = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse =
      await this.purchasingService.createSupplierQuotation(id, req.body);
    sendResponse(res, result);
  };

  getPurchReqQuotations: CombinedValidator<
    idValidatedCtrlr,
    paginationValidatedCtrlr
  > = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result: APIResponse =
      await this.purchasingService.getPurchReqQuotations(
        user,
        id,
        +page,
        +limit,
      );
    sendResponse(res, result);
  };
}
