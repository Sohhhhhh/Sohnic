import { sendResponse } from '../utils/sendResponse';
import { ISalesService } from '../interfaces/services';
import { createSaleValidatedCtrlr } from '../validators/sales.validator';

export class SalesController {
  constructor(private readonly salesService: ISalesService) {}

  create: createSaleValidatedCtrlr = async (req, res) => {
    const result = await this.salesService.create(req.user, req.body);
    sendResponse(res, result);
  };
}
