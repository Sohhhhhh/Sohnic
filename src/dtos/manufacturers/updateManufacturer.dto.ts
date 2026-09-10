import { z } from 'zod';
import { createManufacturerSchema } from './createManufacturer.dto';

export const updateManufacturerBaseSchema = createManufacturerSchema
  .omit({ email: true })
  .partial()
  .strict();

export const updateManufacturerSchema = updateManufacturerBaseSchema.refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided to update.' },
);

export type UpdateManufacturerDto = z.infer<typeof updateManufacturerSchema>;
