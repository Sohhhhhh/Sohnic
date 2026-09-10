import { manufacturersRepository } from './repositories.container';
import { ManufacturersService } from '../services/manufacturers.service';
import { ManufacturersController } from '../controllers/manufacturers.controller';

// ----- Services -----

export const manufacturersService = new ManufacturersService(
  manufacturersRepository,
);

// ----- Controllers -----

export const manufacturersController = new ManufacturersController(
  manufacturersService,
);
