import {
  IManufacturingBatchesRepository,
  IManufacturingBatchesService,
  IManufacturingOrdersRepository,
} from '../interfaces';
import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { CreateManufacturingBatchDto } from '../dtos/manufacturing-batches/createManufacturingBatch.dto';

export class ManufacturingBatchesService
  implements IManufacturingBatchesService
{
  constructor(
    private readonly batchesRepo: IManufacturingBatchesRepository,
    private readonly manufacturingOrdersRepo: IManufacturingOrdersRepository,
  ) {}

  async create(
    orderId: string,
    receivedById: string,
    dto: CreateManufacturingBatchDto,
  ) {
    const order = await this.checkExistingManufacturingOrder(orderId);

    if (order.status !== 'in_production')
      throw new APIError(
        `Batches can only be received for in_production orders (current: "${order.status}").`,
        STATUS_CODES.Conflict,
      );

    const batch = await this.batchesRepo.create({
      ...dto,
      manufacturingOrderId: orderId,
      receivedById,
    });

    return { statusCode: STATUS_CODES.Created, data: batch };
  }

  async findByOrder(orderId: string, page: number, limit: number) {
    await this.checkExistingManufacturingOrder(orderId);

    const batches = await this.batchesRepo.findByOrder(orderId, page, limit);

    return { statusCode: STATUS_CODES.OK, size: batches.length, data: batches };
  }

  async findOne(batchId: string) {
    const batch = await this.checkExistingManufacturingBatch(batchId);
    return { statusCode: STATUS_CODES.OK, data: batch };
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

  private async checkExistingManufacturingBatch(id: string) {
    const batch = await this.batchesRepo.findOne(id);
    if (!batch)
      throw new APIError(
        'No manufacturing batch found with this id.',
        STATUS_CODES.NotFound,
      );

    return batch;
  }
}
