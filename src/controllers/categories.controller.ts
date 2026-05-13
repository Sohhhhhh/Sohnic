import {
  CombinedValidator,
  idValidatedCtrlr,
} from '../validators/common.validator';
import {
  createCategoryValidatedCtrlr,
  updateCategoryValidatedCtrlr,
} from './../validators/categories.validator';
import { APIResponse } from '../types/api.types';
import { ICategoriesService } from '../interfaces';
import { sendResponse } from '../utils/sendResponse';

export class CategoriesController {
  constructor(private readonly categoriesService: ICategoriesService) {}

  create: createCategoryValidatedCtrlr = async (req, res) => {
    const result: APIResponse = await this.categoriesService.create(req.body);
    sendResponse(res, result);
  };

  update: CombinedValidator<idValidatedCtrlr, updateCategoryValidatedCtrlr> =
    async (req, res) => {
      const { id } = req.params;
      const dto = req.body;
      const result: APIResponse = await this.categoriesService.update(id, dto);
      sendResponse(res, result);
    };

  delete: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.categoriesService.delete(id);
    sendResponse(res, result);
  };
}
