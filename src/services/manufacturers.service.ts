import { IManufacturersRepository, IManufacturersService } from '../interfaces';
import { CreateManufacturerDto } from '../dtos/manufacturers/createManufacturer.dto';
import { STATUS_CODES } from '../utils/statusCodes';
import APIError from '../utils/APIError';

export class ManufacturersService implements IManufacturersService {
  constructor(private readonly manufacturersRepo: IManufacturersRepository) {}

  async create(dto: CreateManufacturerDto) {
    await this.checkExistingManufacturer(dto.email);
    const manufacturer = await this.manufacturersRepo.create(dto);

    return {
      statusCode: STATUS_CODES.Created,
      data: { manufacturer },
    };
  }

  // --- Helpers ---
  private async checkExistingManufacturer(email: string) {
    const manufacturer = await this.manufacturersRepo.findOneByEmail(email);

    if (manufacturer)
      throw new APIError(
        'A manufacturer with this email already exists.',
        STATUS_CODES.Conflict,
      );
  }
}
