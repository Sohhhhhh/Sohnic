import { ItemsService } from '../services/items.service';
import { itemsRepository } from './repositories.container';
import { ItemsController } from '../controllers/items.controller';

// ----- Services -----

export const itemsService = new ItemsService(itemsRepository);

// ----- Controllers -----

export const itemsController = new ItemsController(itemsService);
