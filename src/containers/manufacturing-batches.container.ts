import {
  manufacturingOrdersRepository,
  manufacturingBatchesRepository,
} from './repositories.container';
import { ManufacturingBatchesService } from '../services/manufacturing-batches.service';
import { ManufacturingBatchesController } from '../controllers/manufacturing-batches.controller';

// ----- Services -----

export const manufacturingBatchesService = new ManufacturingBatchesService(
  manufacturingBatchesRepository,
  manufacturingOrdersRepository,
);

// ----- Controllers -----

export const manufacturingBatchesController =
  new ManufacturingBatchesController(manufacturingBatchesService);
