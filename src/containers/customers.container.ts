import { customersRepository } from './repositories.container';
import { CustomersService } from '../services/customers.service';
import { CustomersController } from '../controllers/customers.controller';

// ----- Services -----

export const customersService = new CustomersService(customersRepository);

// ----- Controllers -----

export const customersController = new CustomersController(customersService);
