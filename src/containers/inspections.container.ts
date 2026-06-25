import {
  inspectionsRepository,
  itemsRepository,
  purchaseOrdersRepository,
} from './repositories.container';
import { InspectionsService } from '../services/inspections.service';
import { InspectionsController } from '../controllers/inspections.controller';

// ----- Services -----

export const inspectionsService = new InspectionsService(
  inspectionsRepository,
  itemsRepository,
  purchaseOrdersRepository,
);

// ----- Controllers -----

export const inspectionsController = new InspectionsController(
  inspectionsService,
);
