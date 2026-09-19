import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { ITransfersService } from '../interfaces/services';
import { idValidatedCtrlr } from '../validators/common.validator';
import {
  createTransferRequestValidatedCtrlr,
  filterTransferRequestsValidatedCtrlr,
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
}
