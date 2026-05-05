import {
  idValidatedCtrlr,
  CombinedValidator,
  itemIdValidatedCtrlr,
} from '../validators/common.validator';
import {
  createSupplierValidatedCtrlr,
  updateSupplierValidatedCtrlr,
  addItemSupplierValidatedCtrlr,
  filterSuppliersValidatedCtrlr,
  editItemSupplierValidatedCtrlr,
  itemSuppliersQueryValidatedCtrlr,
} from '../validators/suppliers.validator';
import { APIResponse } from '../types/api.types';
import { ISuppliersService } from '../interfaces';
import { sendResponse } from '../utils/sendResponse';

export class SuppliersController {
  constructor(private readonly suppliersService: ISuppliersService) {}

  create: createSupplierValidatedCtrlr = async (req, res) => {
    const result: APIResponse = await this.suppliersService.create(req.body);
    sendResponse(res, result);
  };

  findAll: filterSuppliersValidatedCtrlr = async (req, res) => {
    const q = req.query;

    const result: APIResponse = await this.suppliersService.findAll(q);
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
    const result: APIResponse =
      await this.suppliersService.deleteItemSupplier(id);
    sendResponse(res, result);
  };

  getAllItemsSuppliers: itemSuppliersQueryValidatedCtrlr = async (req, res) => {
    const { page = 1, limit = 10, ...q } = req.query;

    const result: APIResponse =
      await this.suppliersService.getAllItemsSuppliers(
        +page,
        +limit,
        q,
      );
    sendResponse(res, result);
  };

  getItemSuppliers: CombinedValidator<
    idValidatedCtrlr,
    itemSuppliersQueryValidatedCtrlr
  > = async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 10, ...q } = req.query;

    const result: APIResponse = await this.suppliersService.getItemSuppliers(
      id,
      +page,
      +limit,
      q,
    );
    sendResponse(res, result);
  };

  makePrimary: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.suppliersService.makePrimary(id);

    sendResponse(res, result);
  };

  removePrimary: idValidatedCtrlr = async (req, res) => {
    const { id } = req.params;
    const result: APIResponse = await this.suppliersService.removePrimary(id);

    sendResponse(res, result);
  };
}
