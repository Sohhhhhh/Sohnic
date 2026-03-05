import { IUsersService } from '../interfaces';

export class UsersController {
  constructor(private readonly usersService: IUsersService) {}
}
