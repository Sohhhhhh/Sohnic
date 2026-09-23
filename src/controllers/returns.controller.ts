import { IReturnsService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { idValidatedCtrlr } from '../validators/common.validator';
import { createSuppRetValidatedCtrlr } from '../validators/returns.validator';
import { filterSuppRetsValidatedCtrlr } from '../validators/returns.validator';

export class ReturnsController {
  constructor(private readonly returnsService: IReturnsService) {}

  create: createSuppRetValidatedCtrlr = async (req, res) => {
    const result: APIResponse = await this.returnsService.create(req.body);

    sendResponse(res, result);
  };

  findAll: filterSuppRetsValidatedCtrlr = async (req, res) => {
    const { page = 1, limit = 10, ...q } = req.query;
    const result: APIResponse = await this.returnsService.findAll(
      +page,
      +limit,
      q,
    );

    sendResponse(res, result);
  };

  findOne: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.returnsService.findOne(id);

    sendResponse(res, result);
  };

  accept: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user!;
    const result: APIResponse = await this.returnsService.accept(userId, id);

    sendResponse(res, result);
  };

  reject: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.returnsService.reject(id);

    sendResponse(res, result);
  };

  complete: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.returnsService.complete(id);

    sendResponse(res, result);
  };
}
