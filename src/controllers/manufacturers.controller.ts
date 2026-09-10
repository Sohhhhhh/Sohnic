import { IManufacturersService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { createManufacturerValidatedCtrlr } from '../validators/manufacturers.validator';

export class ManufacturersController {
  constructor(private readonly manufacturersService: IManufacturersService) {}

  create: createManufacturerValidatedCtrlr = async (req, res) => {
    const result: APIResponse = await this.manufacturersService.create(
      req.body,
    );
    sendResponse(res, result);
  };
}
