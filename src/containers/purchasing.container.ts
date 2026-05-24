import {
  itemsRepository,
  branchesRepository,
  suppliersRepository,
  purchaseRequestsRepository,
  supplierQuotationsRepository,
  itemSuppliersRepository,
} from './repositories.container';
import { PurchasingService } from '../services/purchasing.service';
import { PurchasingController } from '../controllers/purchasing.controller';

// ----- Services -----

export const purchasingService = new PurchasingService(
  purchaseRequestsRepository,
  itemsRepository,
  branchesRepository,
  supplierQuotationsRepository,
  suppliersRepository,
  itemSuppliersRepository,
);

// ----- Controllers -----

export const purchasingController = new PurchasingController(purchasingService);
