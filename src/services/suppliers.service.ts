import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';
import { APIResponse } from '../types/api.types';
import { CreateSupplierDto } from '../dtos/suppliers/createSupplier.dto';
import { ISuppliersRepository, ISuppliersService } from '../interfaces';
import { UpdateSupplierDto } from '../dtos/suppliers/updateSupplier.dto';

export class SuppliersService implements ISuppliersService {
  constructor(private readonly suppliersRepo: ISuppliersRepository) {}

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
}
