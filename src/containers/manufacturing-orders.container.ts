import {
  itemsRepository,
  manufacturersRepository,
  manufacturingOrdersRepository,
} from './repositories.container';
import { ManufacturingOrdersService } from '../services/manufacturing-orders.service';
import { ManufacturingOrdersController } from '../controllers/manufacturing-orders.controller';

// ----- Services -----

export const manufacturingOrdersService = new ManufacturingOrdersService(
  manufacturingOrdersRepository,
  manufacturersRepository,
  itemsRepository,
);

// ----- Controllers -----

export const manufacturingOrdersController = new ManufacturingOrdersController(
  manufacturingOrdersService,
);
