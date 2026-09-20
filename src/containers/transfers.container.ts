import {
  itemsRepository,
  branchesRepository,
  transfersRepository,
  inventoryRepository,
  inspectionsRepository,
} from './repositories.container';
import { TransfersService } from '../services/transfers.service';
import { TransfersController } from '../controllers/transfers.controller';

// ----- Services -----

export const transfersService = new TransfersService(
  transfersRepository,
  itemsRepository,
  branchesRepository,
  inventoryRepository,
  inspectionsRepository,
);

// ----- Controllers -----

export const transfersController = new TransfersController(transfersService);
