import { z } from 'zod';

export const createCategorySchema = z
  .object({
    name: z.string().min(1, 'Category name is required'),
    parentCategoryId: z
      .string({ message: 'parent category id must be a string' })
      .uuid({ message: 'parent category id must be a valid uuid' })
      .optional(),
  })
  .strict();

export type createCategoryDto = z.output<typeof createCategorySchema>;
