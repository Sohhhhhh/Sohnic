import { APIResponse } from '../types/api.types';
import { ICategoriesService } from '../interfaces';
import { sendResponse } from '../utils/sendResponse';
import { createCategoryValidatedCtrlr } from './../validators/categories.validator';

export class CategoriesController {
  constructor(private readonly categoriesService: ICategoriesService) {}

  create: createCategoryValidatedCtrlr = async (req, res) => {
    const result: APIResponse = await this.categoriesService.create(req.body);
    sendResponse(res, result);
  };
}
