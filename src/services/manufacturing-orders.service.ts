import {
  IManufacturersRepository,
  IManufacturingOrdersRepository,
  IManufacturingOrdersService,
} from '../interfaces';
import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { IItemsRepository } from '../interfaces';
import { CreateManufacturingOrderDto } from '../dtos/manufacturing-orders/createManufacturingOrder.dto';

export class ManufacturingOrdersService implements IManufacturingOrdersService {
  constructor(
    private readonly manufacturingOrdersRepo: IManufacturingOrdersRepository,
    private readonly manufacturersRepo: IManufacturersRepository,
    private readonly itemsRepo: IItemsRepository,
  ) {}

  async create(createdById: string, dto: CreateManufacturingOrderDto) {
    await Promise.all([
      this.checkManufacturerExists(dto.manufacturerId),
      this.checkProductExists(dto.productId),
    ]);

    const order = await this.manufacturingOrdersRepo.create({
      ...dto,
      createdById,
    });

    return {
      statusCode: STATUS_CODES.Created,
      data: order,
    };
  }

  // --- Helpers ---
  private async checkManufacturerExists(id: string) {
    const manufacturer = await this.manufacturersRepo.findOne(id);

    if (!manufacturer)
      throw new APIError(
        'No manufacturer found with this id.',
        STATUS_CODES.NotFound,
      );

    if (!manufacturer.isActive)
      throw new APIError(
        'This manufacturer is not active.',
        STATUS_CODES.Conflict,
      );
  }

  private async checkProductExists(id: string) {
    const item = await this.itemsRepo.findOne(id);

    if (!item)
      throw new APIError(
        'No product found with this id.',
        STATUS_CODES.NotFound,
      );

    if (item.type !== 'sellable_item')
      throw new APIError(
        'The product must be a sellable item.',
        STATUS_CODES.BadRequest,
      );
  }
}
