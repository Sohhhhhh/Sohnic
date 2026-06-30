import {
  createInspectionValidatedCtrlr,
  filterInspectionsValidatedCtrlr,
} from '../validators/inspections.validator';
import { APIResponse } from '../types/api.types';
import { IInspectionsService } from '../interfaces';
import { sendResponse } from '../utils/sendResponse';
import { idValidatedCtrlr } from '../validators/common.validator';

export class InspectionsController {
  constructor(private readonly inspectionsService: IInspectionsService) {}

  create: createInspectionValidatedCtrlr = async (req, res) => {
    const { id } = req.user;
    const result: APIResponse = await this.inspectionsService.create(
      id,
      req.body,
    );
    sendResponse(res, result);
  };

  getAll: filterInspectionsValidatedCtrlr = async (req, res) => {
    const { page, limit, ...q } = req.query;
    const { user } = req;

    const result: APIResponse = await this.inspectionsService.getAll(
      user,
      +page,
      +limit,
      q,
    );
    sendResponse(res, result);
  };

  getOne: idValidatedCtrlr = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    const result: APIResponse = await this.inspectionsService.getOne(user, id);
    sendResponse(res, result);
  };
}
