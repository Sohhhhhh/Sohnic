import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';
import { APIResponse } from '../types/api.types';
import { ICategoriesService } from '../interfaces';
import { createCategoryDto } from '../dtos/categories/createCategory.dto';
import { CategoriesRepository } from '../repositories/categories.repository';

export class CategoriesService implements ICategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async create(dto: createCategoryDto): Promise<APIResponse> {
    const { parentCategoryId } = dto;
    if (parentCategoryId) await this.checkExistingCategory(parentCategoryId);

    const category = await this.categoriesRepo.create(dto);

    return {
      statusCode: STATUS_CODES.OK,
      data: category,
    };
  }

  // --- Helpers ---
  private async checkExistingCategory(categoryId: string) {
    const category = await this.categoriesRepo.findOne(categoryId);

    if (!category)
      throw new APIError(
        'No category found with this id.',
        STATUS_CODES.NotFound,
      );
  }
}
