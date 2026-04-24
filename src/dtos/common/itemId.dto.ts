import { z } from 'zod';

export const itemIdSchema = z.object({
  body: z
    .object({
      itemId: z
        .string({ message: 'item id must be a string' })
        .uuid({ message: 'item id must be a valid uuid' }),
    })
    .strict(),
});

export type ItemIdDto = z.output<typeof itemIdSchema>['body'];
