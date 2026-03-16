import { SuppliersService } from '../services/suppliers.service';
import { SuppliersController } from '../controllers/suppliers.controller';

// ----- Services -----

export const suppliersService = new SuppliersService();

// ----- Controllers -----

export const suppliersController = new SuppliersController(suppliersService);
