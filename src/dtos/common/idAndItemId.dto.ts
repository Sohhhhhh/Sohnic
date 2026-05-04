import { z } from 'zod';
import { idSchema } from './id.dto';
import { itemIdSchema } from './itemId.dto';

export const idAndItemIdSchema = idSchema.merge(itemIdSchema);

export type IdAndItemIdDto = z.output<typeof idAndItemIdSchema>;
