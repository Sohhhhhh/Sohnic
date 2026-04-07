import STATUS_CODES from '../utils/statusCodes';
import { APIResponse } from '../types/api.types';
import { CreateSupplierDto } from '../dtos/createSupplier.dto';
import { ISuppliersRepository, ISuppliersService } from '../interfaces';
import APIError from '../utils/APIError';

export class SuppliersService implements ISuppliersService {
  constructor(private readonly suppliersRepo: ISuppliersRepository) {}

  async create(dto: CreateSupplierDto): Promise<APIResponse> {
    await this.checkExistingSupplier(dto.email);
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

  // --- Helpers ---
  private async checkExistingSupplier(email: string) {
    const existing = await this.suppliersRepo.getSupplierByEmail(email);

    if (existing)
      throw new APIError(
        'A supplier with this email already exists.',
        STATUS_CODES.Conflict,
      );
  }
}
