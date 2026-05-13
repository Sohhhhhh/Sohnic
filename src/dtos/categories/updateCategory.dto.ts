import { z } from 'zod';

export const updateCategorySchema = z
  .object({
    name: z.string().min(1, 'Category name is required').optional(),

    parentCategoryId: z
      .string({ message: 'parent category id must be a string' })
      .uuid({ message: 'parent category id must be a valid uuid' })
      .nullable()
      .optional(),
  })
  .strict();

export type UpdateCategoryDto = z.output<typeof updateCategorySchema>;
