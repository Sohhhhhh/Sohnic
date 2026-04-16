import { RequestHandler } from 'express';
import { IUsersService } from '../interfaces';
import { APIResponse } from '../types/api.types';
import { sendResponse } from '../utils/sendResponse';
import { IdDto } from '../dtos/common/id.dto';

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

  updateBranch: RequestHandler<IdDto> = async (req, res, next) => {
    const { id } = req.params;
    const { branchId } = req.body;
    const result: APIResponse = await this.usersService.updateBranch(
      id,
      branchId,
      req.user!.id,
    );
    sendResponse(res, result);
  };

  updateRole: RequestHandler<IdDto> = async (req, res, next) => {
    const { id } = req.params;
    const { roleId } = req.body;
    const result: APIResponse = await this.usersService.updateRole(
      id,
      roleId,
      req.user!.id,
    );
    sendResponse(res, result);
  };

  activate: RequestHandler<IdDto> = async (req, res, next) => {
    const { id } = req.params;
    const result: APIResponse = await this.usersService.activate(id);
    sendResponse(res, result);
  };

  deactivate: RequestHandler<IdDto> = async (req, res, next) => {
    const { id } = req.params;
    const result: APIResponse = await this.usersService.deactivate(
      id,
      req.user!.id,
    );
    sendResponse(res, result);
  };
}
