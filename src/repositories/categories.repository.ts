import { eq, isNull } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { categories } from '../../drizzle/schema';
import { ICategoriesRepository } from '../interfaces';
import { CreateCategoryDto } from '../dtos/categories/createCategory.dto';
import { UpdateCategoryDto } from '../dtos/categories/updateCategory.dto';

export class CategoriesRepository implements ICategoriesRepository {
  async create(dto: CreateCategoryDto) {
    const category = await db
      .insert(categories)
      .values({ ...dto })
      .returning();

    return category[0];
  }

  async getParentCategories() {
    const parentCategories = await db.query.categories.findMany({
      where: isNull(categories.parentCategoryId),
    });

    return parentCategories;
  }

  async findOne(id: string) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await db
      .update(categories)
      .set({ ...dto })
      .where(eq(categories.id, id))
      .returning();

    return category[0];
  }

  async delete(id: string) {
    const target = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    await db
      .update(categories)
      .set({ parentCategoryId: target?.parentCategoryId ?? null })
      .where(eq(categories.parentCategoryId, id));

    await db.delete(categories).where(eq(categories.id, id));
    return;
  }

  async getChildCategories(id: string) {
    const childCategories = await db.query.categories.findMany({
      where: eq(categories.parentCategoryId, id),
    });

    return childCategories;
  }
}
