import { ItemsService } from '../services/items.service';
import { ItemsController } from '../controllers/items.controller';
import {
  itemsRepository,
  itemSuppliersRepository,
  bomRepository,
} from './repositories.container';

// ----- Services -----

export const itemsService = new ItemsService(
  itemsRepository,
  itemSuppliersRepository,
  bomRepository,
);

// ----- Controllers -----

export const itemsController = new ItemsController(itemsService);
