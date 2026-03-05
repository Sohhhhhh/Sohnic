import { UsersService } from '../services/users.service';
import { UsersController } from '../controllers/users.controller';

// ----- Services -----

export const usersService = new UsersService();

// ----- Controllers -----

export const usersController = new UsersController(usersService);
