import { IManufacturersService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { idValidatedCtrlr } from '../validators/common.validator';
import {
  createManufacturerValidatedCtrlr,
  manufacturersQueryValidatedCtrlr,
} from '../validators/manufacturers.validator';

export class ManufacturersController {
  constructor(private readonly manufacturersService: IManufacturersService) {}

  create: createManufacturerValidatedCtrlr = async (req, res) => {
    const result: APIResponse = await this.manufacturersService.create(
      req.body,
    );
    sendResponse(res, result);
  };

  findAll: manufacturersQueryValidatedCtrlr = async (req, res) => {
    const { page = 1, limit = 10, ...q } = req.query;
    const result: APIResponse = await this.manufacturersService.findAll(
      +page,
      +limit,
      q,
    );
    sendResponse(res, result);
  };

  findOne: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.manufacturersService.findOne(id);
    sendResponse(res, result);
  };
}

