import { RequestHandler } from 'express';

import { APIResponse } from '../types/api.types';
import { ISuppliersService } from '../interfaces';
import { sendResponse } from '../utils/sendResponse';
import {
  CombinedValidator,
  idValidatedCtrlr,
  itemIdValidatedCtrlr,
  paginationValidatedCtrlr,
} from '../validators/common.validator';
import {
  createSupplierValidatedCtrlr,
  updateSupplierValidatedCtrlr,
  addItemSupplierValidatedCtrlr,
  editItemSupplierValidatedCtrlr,
} from '../validators/suppliers.validator';

export class SuppliersController {
  constructor(private readonly suppliersService: ISuppliersService) {}

  create: createSupplierValidatedCtrlr = async (req, res) => {
    const result: APIResponse = await this.suppliersService.create(req.body);
    sendResponse(res, result);
  };

  findAll: RequestHandler = async (req, res) => {
    const result: APIResponse = await this.suppliersService.findAll();
    sendResponse(res, result);
  };

  findOne: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.suppliersService.findOne(id);
    sendResponse(res, result);
  };

  update: CombinedValidator<idValidatedCtrlr, updateSupplierValidatedCtrlr> =
    async (req, res) => {
      const { id } = req.params;
      const dto = req.body;
      const result: APIResponse = await this.suppliersService.update(id, dto);
      sendResponse(res, result);
    };

  deactivate: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.suppliersService.deactivate(id);
    sendResponse(res, result);
  };

  activate: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.suppliersService.activate(id);
    sendResponse(res, result);
  };

  addItemSupplier: CombinedValidator<
    idValidatedCtrlr,
    addItemSupplierValidatedCtrlr
  > = async (req, res) => {
    const { id } = req.params;
    const dto = req.body;
    const result: APIResponse = await this.suppliersService.addItemSupplier(
      dto,
      id,
    );
    sendResponse(res, result);
  };

  editItemSupplier: CombinedValidator<
    idValidatedCtrlr,
    editItemSupplierValidatedCtrlr
  > = async (req, res) => {
    const { id } = req.params;
    const dto = req.body;
    const result: APIResponse = await this.suppliersService.editItemSupplier(
      dto,
      id,
    );
    sendResponse(res, result);
  };

  deleteItemSupplier: CombinedValidator<
    idValidatedCtrlr,
    itemIdValidatedCtrlr
  > = async (req, res) => {
    const { id } = req.params;
    const { itemId } = req.body;
    const result: APIResponse = await this.suppliersService.deleteItemSupplier(
      id,
      itemId,
    );
    sendResponse(res, result);
  };

  getAllItemsSuppliers: paginationValidatedCtrlr = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const result: APIResponse =
      await this.suppliersService.getAllItemsSuppliers(page, limit);
    sendResponse(res, result);
  };

  getItemSuppliers: CombinedValidator<
    idValidatedCtrlr,
    paginationValidatedCtrlr
  > = async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result: APIResponse = await this.suppliersService.getItemSuppliers(
      id,
      +page,
      +limit,
    );
    sendResponse(res, result);
  };
}
