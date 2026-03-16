import { RequestHandler } from 'express';
import { APIResponse } from '../types/api.types';
import { ISuppliersService } from '../interfaces';
import { sendResponse } from '../utils/sendResponse';

export class SuppliersController {
  constructor(private readonly suppliersService: ISuppliersService) {}

  create: RequestHandler = async (req, res) => {
    const result: APIResponse = await this.suppliersService.create(req.body);
    sendResponse(res, result);
  };
}
