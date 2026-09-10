import { z } from 'zod';

export const createManufacturerSchema = z
  .object({
    companyName: z.string(),
    city: z.string(),
    country: z.string(),
    address: z.string(),
    phone: z.e164(),
    email: z.email(),
  })
  .strict();

export type CreateManufacturerDto = z.infer<typeof createManufacturerSchema>;
