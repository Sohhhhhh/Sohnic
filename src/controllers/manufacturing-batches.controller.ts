import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { IManufacturingBatchesService } from '../interfaces';
import { createManufacturingBatchValidatedCtrlr } from '../validators/manufacturing-batches.validator';
import {
  idValidatedCtrlr,
  CombinedValidator,
  paginationValidatedCtrlr,
} from '../validators/common.validator';

export class ManufacturingBatchesController {
  constructor(
    private readonly manufacturingBatchesService: IManufacturingBatchesService,
  ) {}

  create: CombinedValidator<
    idValidatedCtrlr,
    createManufacturingBatchValidatedCtrlr
  > = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse =
      await this.manufacturingBatchesService.create(
        id,
        req.user!.id,
        req.body,
      );
    sendResponse(res, result);
  };

  findByOrder: CombinedValidator<
    idValidatedCtrlr,
    paginationValidatedCtrlr
  > = async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result: APIResponse =
      await this.manufacturingBatchesService.findByOrder(id, +page, +limit);
    sendResponse(res, result);
  };

  findOne: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse =
      await this.manufacturingBatchesService.findOne(id);
    sendResponse(res, result);
  };
}
