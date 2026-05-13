import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';
import { APIResponse } from '../types/api.types';
import { ICategoriesService } from '../interfaces';
import { CreateCategoryDto } from '../dtos/categories/createCategory.dto';
import { CategoriesRepository } from '../repositories/categories.repository';
import { UpdateCategoryDto } from '../dtos/categories/updateCategory.dto';

export class CategoriesService implements ICategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async create(dto: CreateCategoryDto): Promise<APIResponse> {
    const { parentCategoryId } = dto;
    if (parentCategoryId)
      await this.checkExistingCategory(parentCategoryId, true);

    const category = await this.categoriesRepo.create(dto);

    return {
      statusCode: STATUS_CODES.OK,
      data: category,
    };
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const { parentCategoryId } = dto;

    await Promise.all([
      this.checkExistingCategory(id),
      parentCategoryId && this.checkExistingCategory(parentCategoryId, true),
    ]);

    const category = await this.categoriesRepo.update(id, dto);

    return {
      statusCode: STATUS_CODES.OK,
      data: category,
    };
  }

  // --- Helpers ---
  private async checkExistingCategory(
    categoryId: string,
    parent: boolean = false,
  ) {
    const category = await this.categoriesRepo.findOne(categoryId);

    if (!category)
      throw new APIError(
        `No ${parent ? 'parent ' : ''}category found with this id.`,
        STATUS_CODES.NotFound,
      );
  }
}
