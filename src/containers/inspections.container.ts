import {
  itemsRepository,
  branchesRepository,
  inventoryRepository,
  transfersRepository,
  inspectionsRepository,
  purchaseOrdersRepository,
  manufacturingBatchesRepository,
} from './repositories.container';
import { InspectionsService } from '../services/inspections.service';
import { InspectionsController } from '../controllers/inspections.controller';

// ----- Services -----

export const inspectionsService = new InspectionsService(
  inspectionsRepository,
  itemsRepository,
  purchaseOrdersRepository,
  manufacturingBatchesRepository,
  branchesRepository,
  inventoryRepository,
  transfersRepository,
);

// ----- Controllers -----

export const inspectionsController = new InspectionsController(
  inspectionsService,
);
