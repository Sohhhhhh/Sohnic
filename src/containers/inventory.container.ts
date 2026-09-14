import { inventoryRepository } from './repositories.container';
import { InventoryService } from '../services/inventory.service';
import { InventoryController } from '../controllers/inventory.controller';

// ----- Services -----

export const inventoryService = new InventoryService(inventoryRepository);

// ----- Controllers -----

export const inventoryController = new InventoryController(inventoryService);
