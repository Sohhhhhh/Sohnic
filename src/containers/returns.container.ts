import {
  purchaseOrdersRepository,
  inspectionsRepository,
  supplierReturnsRepository,
} from './repositories.container';
import { ReturnsService } from '../services/returns.service';
import { ReturnsController } from '../controllers/returns.controller';

// ----- Services -----

export const returnsSrevice = new ReturnsService(
  supplierReturnsRepository,
  inspectionsRepository,
  purchaseOrdersRepository,
);

// ----- Controllers -----

export const returnsController = new ReturnsController(returnsSrevice);
