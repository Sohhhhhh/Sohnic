import { RequestHandler } from 'express';
import { IUsersService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';

export class UsersController {
  constructor(private readonly usersService: IUsersService) {}

  findAll: RequestHandler = async (req, res, next) => {
    const result: APIResponse = await this.usersService.findAll(req.user!);
    sendResponse(res, result);
  };
}
