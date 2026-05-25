import { z } from 'zod';
import { idSchema } from './id.dto';
import { quotationIdSchema } from './quotationId.dto';

export const idAndQuotationIdSchema = idSchema.merge(quotationIdSchema);

export type IdAndQuotationIdDto = z.output<typeof idAndQuotationIdSchema>;
