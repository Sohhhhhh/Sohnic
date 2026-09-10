import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { APIResponse } from '../types/api.types';
import { ICategoriesRepository, ICategoriesService } from '../interfaces';
import { CreateCategoryDto } from '../dtos/categories/createCategory.dto';
import { UpdateCategoryDto } from '../dtos/categories/updateCategory.dto';

export class CategoriesService implements ICategoriesService {
  constructor(private readonly categoriesRepo: ICategoriesRepository) {}

  async create(dto: CreateCategoryDto): Promise<APIResponse> {
    const { parentCategoryId } = dto;
    if (parentCategoryId)
      await this.checkExistingCategory(parentCategoryId, true);

    const category = await this.categoriesRepo.create(dto);

    return {
      statusCode: STATUS_CODES.Created,
      data: category,
    };
  }

  async getParentCategories(): Promise<APIResponse> {
    const parentCategories = await this.categoriesRepo.getParentCategories();

    return {
      statusCode: STATUS_CODES.OK,
      size: parentCategories.length,
      data: parentCategories,
    };
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<APIResponse> {
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

  async delete(id: string): Promise<APIResponse> {
    (await this.checkExistingCategory(id),
      await this.categoriesRepo.delete(id));

    return {
      statusCode: STATUS_CODES.NoContent,
      message: 'Category, and all its children deleted successfully',
    };
  }

  async getChildCategories(id: string): Promise<APIResponse> {
    const childCategories = await this.categoriesRepo.getChildCategories(id);

    return {
      statusCode: STATUS_CODES.OK,
      size: childCategories.length,
      data: childCategories,
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
