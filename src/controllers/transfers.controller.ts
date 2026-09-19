import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { ITransfersService } from '../interfaces/services';
import { createTransferRequestValidatedCtrlr } from '../validators/transfers.validator';

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
}
