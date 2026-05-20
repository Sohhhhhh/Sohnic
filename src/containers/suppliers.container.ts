import {
  suppliersRepository,
  itemSuppliersRepository,
} from './repositories.container';
import { itemsService } from './items.container';
import { SuppliersService } from '../services/suppliers.service';
import { SuppliersController } from '../controllers/suppliers.controller';

// ----- Services -----

export const suppliersService = new SuppliersService(
  suppliersRepository,
  itemSuppliersRepository,
  itemsService,
);

// ----- Controllers -----

export const suppliersController = new SuppliersController(suppliersService);
