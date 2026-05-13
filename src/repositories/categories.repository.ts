import { eq } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { categories } from '../../drizzle/schema';
import { ICategoriesRepository } from '../interfaces';
import { createCategoryDto } from '../dtos/categories/createCategory.dto';

export class CategoriesRepository implements ICategoriesRepository {
  async create(dto: createCategoryDto) {
    const category = await db
      .insert(categories)
      .values({ ...dto })
      .returning();

    return category[0];
  }

  async findOne(id: string) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    return category;
  }
}
