import {
  IManufacturersRepository,
  IManufacturingOrdersRepository,
  IManufacturingOrdersService,
} from '../interfaces';
import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { IItemsRepository } from '../interfaces';
import { CreateManufacturingOrderDto } from '../dtos/manufacturing-orders/createManufacturingOrder.dto';
import { FilterManufacturingOrdersDto } from '../dtos/manufacturing-orders/filterManufacturingOrder.dto';
import { APIResponse } from '../types/api.types';

export class ManufacturingOrdersService implements IManufacturingOrdersService {
  constructor(
    private readonly manufacturingOrdersRepo: IManufacturingOrdersRepository,
    private readonly manufacturersRepo: IManufacturersRepository,
    private readonly itemsRepo: IItemsRepository,
  ) {}

  async create(createdById: string, dto: CreateManufacturingOrderDto) {
    await Promise.all([
      this.checkExistingManufacturer(dto.manufacturerId),
      this.checkExistingProduct(dto.productId),
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

  async findAll(
    page: number,
    limit: number,
    q?: FilterManufacturingOrdersDto,
  ): Promise<APIResponse> {
    const orders = await this.manufacturingOrdersRepo.findAll(page, limit, q);

    return {
      statusCode: STATUS_CODES.OK,
      size: orders.length,
      data: orders,
    };
  }

  async findOne(id: string): Promise<APIResponse> {
    const order = await this.checkExistingManufacturingOrder(id);

    return {
      statusCode: STATUS_CODES.OK,
      data: order,
    };
  }

  // --- Helpers ---
  private async checkExistingManufacturingOrder(id: string) {
    const order = await this.manufacturingOrdersRepo.findOne(id);

    if (!order)
      throw new APIError(
        'No manufacturing order found with this id.',
        STATUS_CODES.NotFound,
      );

    return order;
  }

  private async checkExistingManufacturer(id: string) {
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

  private async checkExistingProduct(id: string) {
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
