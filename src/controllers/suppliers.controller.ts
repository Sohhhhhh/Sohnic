import { RequestHandler } from 'express';
import { APIResponse } from '../types/api.types';
import { ISuppliersService } from '../interfaces';
import { sendResponse } from '../utils/sendResponse';
import { IdDto } from '../dtos/common/id.dto';

export class SuppliersController {
  constructor(private readonly suppliersService: ISuppliersService) {}

  create: RequestHandler = async (req, res) => {
    const result: APIResponse = await this.suppliersService.create(req.body);
    sendResponse(res, result);
  };

  findAll: RequestHandler = async (req, res) => {
    const result: APIResponse = await this.suppliersService.findAll();
    sendResponse(res, result);
  };

  findOne: RequestHandler<IdDto> = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.suppliersService.findOne(id);
    sendResponse(res, result);
  };

  update: RequestHandler<IdDto> = async (req, res) => {
    const { id } = req.params;
    const dto = req.body;
    const result: APIResponse = await this.suppliersService.update(id, dto);
    sendResponse(res, result);
  };

  deactivate: RequestHandler<IdDto> = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.suppliersService.deactivate(id);
    sendResponse(res, result);
  };

  activate: RequestHandler<IdDto> = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.suppliersService.activate(id);
    sendResponse(res, result);
  };

  addItemSupplier: RequestHandler<IdDto> = async (req, res) => {
    const { id } = req.params;
    const dto = req.body;
    const result: APIResponse = await this.suppliersService.addItemSupplier(
      dto,
      id,
    );
    sendResponse(res, result);
  };
}
