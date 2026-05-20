import {
  branchesRepository,
  itemsRepository,
  purchaseRequestsRepository,
} from './repositories.container';
import { PurchasingService } from '../services/purchasing.service';
import { PurchasingController } from '../controllers/purchasing.controller';

// ----- Services -----

export const purchasingService = new PurchasingService(
  purchaseRequestsRepository,
  itemsRepository,
  branchesRepository,
);

// ----- Controllers -----

export const purchasingController = new PurchasingController(purchasingService);
