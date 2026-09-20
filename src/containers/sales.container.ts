import {
  salesRepository,
  itemsRepository,
  inventoryRepository,
  customersRepository,
} from './repositories.container';
import { SalesService } from '../services/sales.service';
import { SalesController } from '../controllers/sales.controller';

// ----- Services -----

export const salesService = new SalesService(
  salesRepository,
  itemsRepository,
  inventoryRepository,
  customersRepository,
);

// ----- Controllers -----

export const salesController = new SalesController(salesService);
