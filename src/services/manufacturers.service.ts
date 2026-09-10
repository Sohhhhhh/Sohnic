import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { IManufacturersRepository, IManufacturersService } from '../interfaces';
import { CreateManufacturerDto } from '../dtos/manufacturers/createManufacturer.dto';
import { FilterManufacturersDto } from '../dtos/manufacturers/filterManufacturers.dto';
import { UpdateManufacturerDto } from '../dtos/manufacturers/updateManufacturer.dto';

export class ManufacturersService implements IManufacturersService {
  constructor(private readonly manufacturersRepo: IManufacturersRepository) {}

  async create(dto: CreateManufacturerDto) {
    await this.checkExistingManufacturerByEmail(dto.email);
    const manufacturer = await this.manufacturersRepo.create(dto);

    return {
      statusCode: STATUS_CODES.Created,
      data: { manufacturer },
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    q?: FilterManufacturersDto,
  ) {
    const manufacturers = await this.manufacturersRepo.findAll(page, limit, q);

    return {
      statusCode: STATUS_CODES.OK,
      size: manufacturers.length,
      data: manufacturers,
    };
  }

  async findOne(id: string) {
    const manufacturer = await this.checkExistingManufacturerById(id);

    return {
      statusCode: STATUS_CODES.OK,
      data: { manufacturer },
    };
  }

  async update(id: string, dto: UpdateManufacturerDto) {
    await this.checkExistingManufacturerById(id);
    const manufacturer = await this.manufacturersRepo.update(id, dto);

    return {
      statusCode: STATUS_CODES.OK,
      data: { manufacturer },
    };
  }

  // --- Helpers ---
  private async checkExistingManufacturerByEmail(email: string) {
    const manufacturer = await this.manufacturersRepo.findOneByEmail(email);

    if (manufacturer)
      throw new APIError(
        'A manufacturer with this email already exists.',
        STATUS_CODES.Conflict,
      );
  }

  private async checkExistingManufacturerById(id: string) {
    const manufacturer = await this.manufacturersRepo.findOne(id);

    if (!manufacturer)
      throw new APIError(
        'No manufacturer found with this id.',
        STATUS_CODES.NotFound,
      );

    return manufacturer;
  }
}
