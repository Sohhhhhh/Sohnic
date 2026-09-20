import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { ITransfersService } from '../interfaces/services';
import {
  idValidatedCtrlr,
  CombinedValidator,
} from '../validators/common.validator';
import {
  createTransferRequestValidatedCtrlr,
  filterTransferRequestsValidatedCtrlr,
  approveTransferRequestValidatedCtrlr,
  rejectTransferRequestValidatedCtrlr,
  receiveTransferRequestValidatedCtrlr,
} from '../validators/transfers.validator';

export class TransfersController {
  constructor(private readonly transfersService: ITransfersService) {}

  create: createTransferRequestValidatedCtrlr = async (req, res) => {
    const { user } = req;
    const result: APIResponse = await this.transfersService.create(
      user,
      req.body,
    );
    sendResponse(res, result);
  };

  findAll: filterTransferRequestsValidatedCtrlr = async (req, res) => {
    const { user } = req;
    const { page = 1, limit = 10, ...q } = req.query;
    const result: APIResponse = await this.transfersService.findAll(
      user,
      +page,
      +limit,
      q,
    );
    sendResponse(res, result);
  };

  findOne: idValidatedCtrlr = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const result: APIResponse = await this.transfersService.findOne(user, id);
    sendResponse(res, result);
  };

  approve: CombinedValidator<
    idValidatedCtrlr,
    approveTransferRequestValidatedCtrlr
  > = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const result: APIResponse = await this.transfersService.approve(
      user,
      id,
      req.body,
    );
    sendResponse(res, result);
  };

  reject: CombinedValidator<
    idValidatedCtrlr,
    rejectTransferRequestValidatedCtrlr
  > = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const result: APIResponse = await this.transfersService.reject(
      user,
      id,
      req.body,
    );
    sendResponse(res, result);
  };

  dispatch: idValidatedCtrlr = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const result: APIResponse = await this.transfersService.dispatch(user, id);
    sendResponse(res, result);
  };

  receive: CombinedValidator<
    idValidatedCtrlr,
    receiveTransferRequestValidatedCtrlr
  > = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const result: APIResponse = await this.transfersService.receive(
      user,
      id,
      req.body,
    );
    sendResponse(res, result);
  };

  complete: idValidatedCtrlr = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const result: APIResponse = await this.transfersService.complete(user, id);
    sendResponse(res, result);
  };

  cancel: idValidatedCtrlr = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const result: APIResponse = await this.transfersService.cancel(user, id);
    sendResponse(res, result);
  };
}
