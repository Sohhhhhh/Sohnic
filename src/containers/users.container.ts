import { UsersService } from '../services/users.service';
import { UsersController } from '../controllers/users.controller';
import {
  branchesRepository,
  rolesRepository,
  usersRepository,
} from './repositories.container';

// ----- Services -----

export const usersService = new UsersService(
  usersRepository,
  branchesRepository,
  rolesRepository,
);

// ----- Controllers -----

export const usersController = new UsersController(usersService);
