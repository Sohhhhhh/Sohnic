import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { IManufacturingOrdersService } from '../interfaces';
import { createManufacturingOrderValidatedCtrlr } from '../validators/manufacturing-orders.validator';

export class ManufacturingOrdersController {
  constructor(
    private readonly manufacturingOrdersService: IManufacturingOrdersService,
  ) {}

  create: createManufacturingOrderValidatedCtrlr = async (req, res) => {
    const { id } = req.user;
    const result: APIResponse = await this.manufacturingOrdersService.create(
      id,
      req.body,
    );
    sendResponse(res, result);
  };
}
