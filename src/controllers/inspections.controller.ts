import { APIResponse } from '../types/api.types';
import { IInspectionsService } from '../interfaces';
import { sendResponse } from '../utils/sendResponse';
import { createInspectionValidatedCtrlr } from '../validators/inspections.validator';

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
}
