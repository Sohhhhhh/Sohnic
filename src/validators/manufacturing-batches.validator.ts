import { validate } from '../middlewares/validate';
import { createManufacturingBatchSchema } from '../dtos/manufacturing-batches/createManufacturingBatch.dto';

// CREATE MANUFACTURING BATCH
export const validateCreateManufacturingBatch = validate({
  body: createManufacturingBatchSchema,
});
export type createManufacturingBatchValidatedCtrlr =
  typeof validateCreateManufacturingBatch;
