import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';
import { APIResponse } from '../types/api.types';
import {
  IItemSuppliersRepository,
  ISuppliersRepository,
  ISuppliersService,
} from '../interfaces';
import { CreateSupplierDto } from '../dtos/suppliers/createSupplier.dto';
import { UpdateSupplierDto } from '../dtos/suppliers/updateSupplier.dto';
import { AddItemSupplierDto } from '../dtos/suppliers/addItemSupplier.dto';
import { EditItemSupplierDto } from '../dtos/suppliers/editItemSupplier.dto';

export class SuppliersService implements ISuppliersService {
  constructor(
    private readonly suppliersRepo: ISuppliersRepository,
    private readonly itemSupplierRepo: IItemSuppliersRepository,
  ) {}

  async create(dto: CreateSupplierDto): Promise<APIResponse> {
    await this.checkExistingSupplierByEmail(dto.email);
    const supplier = await this.suppliersRepo.create(dto);

    return {
      statusCode: STATUS_CODES.Created,
      data: { supplier },
    };
  }

  async findAll(): Promise<APIResponse> {
    const suppliers = await this.suppliersRepo.findAll();

    return {
      statusCode: STATUS_CODES.OK,
      size: suppliers.length,
      data: suppliers,
    };
  }

  async findOne(supplierId: string): Promise<APIResponse> {
    const supplier = await this.checkExistingSupplierById(supplierId);

    return {
      statusCode: STATUS_CODES.OK,
      data: supplier,
    };
  }

  async update(
    supplierId: string,
    dto: UpdateSupplierDto,
  ): Promise<APIResponse> {
    await this.checkExistingSupplierById(supplierId);
    const updatedSupplier = await this.suppliersRepo.update(supplierId, dto);

    return {
      statusCode: STATUS_CODES.OK,
      data: updatedSupplier,
    };
  }

  async deactivate(supplierId: string): Promise<APIResponse> {
    const supplier = await this.checkExistingSupplierById(supplierId);
    if (!supplier.isActive)
      throw new APIError(
        'The supplier is already deactivated.',
        STATUS_CODES.Conflict,
      );

    const updatedSupplier = await this.suppliersRepo.deactivate(supplierId);

    return {
      statusCode: STATUS_CODES.OK,
      data: updatedSupplier,
    };
  }

  async activate(supplierId: string): Promise<APIResponse> {
    const supplier = await this.checkExistingSupplierById(supplierId);
    if (supplier.isActive)
      throw new APIError(
        'The supplier is already active.',
        STATUS_CODES.Conflict,
      );

    const updatedSupplier = await this.suppliersRepo.activate(supplierId);

    return {
      statusCode: STATUS_CODES.OK,
      data: updatedSupplier,
    };
  }

  async addItemSupplier(
    dto: AddItemSupplierDto,
    supplierId: string,
  ): Promise<APIResponse> {
    const { itemId } = dto;
    const [itemSupplier] = await Promise.all([
      this.itemSupplierRepo.findOne(supplierId, itemId),
      this.checkExistingSupplierById(supplierId),
      this.checkExistingItem(itemId),
    ]);

    if (itemSupplier)
      throw new APIError(
        'This item supplier already exists',
        STATUS_CODES.Conflict,
      );

    const data = await this.itemSupplierRepo.addItemSupplier(dto, supplierId);

    return { statusCode: STATUS_CODES.Created, data };
  }

  async editItemSupplier(
    dto: EditItemSupplierDto,
    id: string,
  ): Promise<APIResponse> {
    await this.checkExistingItemSupplierById(id);

    const data = await this.itemSupplierRepo.editItemSupplier(id, dto);

    return { statusCode: STATUS_CODES.Created, data };
  }

  async deleteItemSupplier(id: string): Promise<APIResponse> {
    await this.checkExistingItemSupplierById(id);
    await this.itemSupplierRepo.deleteItemSupplier(id);

    return {
      statusCode: STATUS_CODES.NoContent,
      message: 'Item supplier deleted successfully',
    };
  }

  async getAllItemsSuppliers(
    page: number = 1,
    limit: number = 10,
  ): Promise<APIResponse> {
    const { data, size } = await this.itemSupplierRepo.getAllItemsSuppliers(
      page,
      limit,
    );

    return { statusCode: STATUS_CODES.OK, size, data };
  }

  async getItemSuppliers(
    itemId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<APIResponse> {
    const { data, size } = await this.itemSupplierRepo.getItemSuppliers(
      itemId,
      page,
      limit,
    );

    return { statusCode: STATUS_CODES.OK, size, data };
  }

  // --- Helpers ---
  private async checkExistingSupplierByEmail(email: string) {
    const supplier = await this.suppliersRepo.getSupplierByEmail(email);

    if (supplier)
      throw new APIError(
        'A supplier with this email already exists.',
        STATUS_CODES.Conflict,
      );
  }

  private async checkExistingSupplierById(supplierId: string) {
    const supplier = await this.suppliersRepo.findOne(supplierId);

    if (!supplier)
      throw new APIError(
        'No supplier found with this id.',
        STATUS_CODES.NotFound,
      );

    return supplier;
  }

  // will do it when i create items module :)
  private async checkExistingItem(itemId: string) {
    return true;
  }

  private async checkExistingItemSupplierById(id: string) {
    const itemSupplier = await this.itemSupplierRepo.findOneById(id);

    if (!itemSupplier)
      throw new APIError(
        'No Item supplier found with this id.',
        STATUS_CODES.NotFound,
      );

    return itemSupplier;
  }
}
