import { ItemsService } from '../services/items.service';
import { itemsRepository, itemSuppliersRepository } from './repositories.container';
import { ItemsController } from '../controllers/items.controller';

// ----- Services -----

export const itemsService = new ItemsService(itemsRepository, itemSuppliersRepository);

// ----- Controllers -----

export const itemsController = new ItemsController(itemsService);
