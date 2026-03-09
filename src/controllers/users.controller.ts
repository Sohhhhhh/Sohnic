import { RequestHandler } from 'express';
import { IUsersService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { IdDto } from '../dtos/id.dto';

export class UsersController {
  constructor(private readonly usersService: IUsersService) {}

  findAll: RequestHandler = async (req, res, next) => {
    const result: APIResponse = await this.usersService.findAll(req.user!);
    sendResponse(res, result);
  };

  findOne: RequestHandler<IdDto> = async (req, res, next) => {
    const { id } = req.params;
    const result: APIResponse = await this.usersService.findOne(req.user!, id);
    sendResponse(res, result);
  };
}
