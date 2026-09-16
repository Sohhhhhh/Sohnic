import {
  IBomRepository,
  IInventoryRepository,
  IManufacturersRepository,
  IManufacturingOrdersRepository,
  IManufacturingOrdersService,
} from '../interfaces';
import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { IItemsRepository } from '../interfaces';
import { ManufacturingOrderStatus } from '../../drizzle/schema';
import { CreateManufacturingOrderDto } from '../dtos/manufacturing-orders/createManufacturingOrder.dto';
import { FilterManufacturingOrdersDto } from '../dtos/manufacturing-orders/filterManufacturingOrder.dto';
import { MFG_ORDER_NON_CANCELLABLE } from '../constants/manufacturingOrders.constants';
import { APIResponse } from '../types/api.types';

export class ManufacturingOrdersService implements IManufacturingOrdersService {
  constructor(
    private readonly manufacturingOrdersRepo: IManufacturingOrdersRepository,
    private readonly manufacturersRepo: IManufacturersRepository,
    private readonly itemsRepo: IItemsRepository,
    private readonly inventoryRepo: IInventoryRepository,
    private readonly bomRepo: IBomRepository,
  ) {}

  async create(createdById: string, dto: CreateManufacturingOrderDto) {
    await Promise.all([
      this.checkExistingManufacturer(dto.manufacturerId),
      this.checkExistingProduct(dto.productId),
    ]);

    // fetch BOM and calculate required
    const bom = await this.bomRepo.getBomByItemId(dto.productId);
    if (!bom.length)
      throw new APIError(
        'No BOM found for this product.',
        STATUS_CODES.NotFound,
      );

    const requiredMaterials = bom.map((entry) => ({
      materialId: entry.componentId,
      quantity: entry.quantityPerUnit * dto.quantity,
      unitCost: entry.standardPrice ?? '0',
    }));

    // 3. check stock for all materials in one query
    await this.checkMaterialsStock(requiredMaterials);

    // 4. create order + populate materials atomically
    const order = await this.manufacturingOrdersRepo.createWithMaterials(
      {
        ...dto,
        createdById,
      },
      requiredMaterials,
    );

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
  async approve(userId: string, id: string): Promise<APIResponse> {
    await this.checkTransition(id, 'approved', { allowedFrom: ['pending'] });
    const order = await this.manufacturingOrdersRepo.updateOrder(id, {
      status: 'approved',
      approvedById: userId,
      approvalDate: new Date(),
    });
    return { statusCode: STATUS_CODES.OK, data: { order } };
  }

  async reject(id: string, rejectionReason: string): Promise<APIResponse> {
    await this.checkTransition(id, 'rejected', { allowedFrom: ['pending'] });
    const order = await this.manufacturingOrdersRepo.updateOrder(id, {
      status: 'rejected',
      rejectionReason,
    });
    return { statusCode: STATUS_CODES.OK, data: { order } };
  }

  async sendMaterials(id: string): Promise<APIResponse> {
    await this.checkTransition(id, 'materials_sent', {
      allowedFrom: ['approved'],
    });
    const order = await this.manufacturingOrdersRepo.updateOrder(id, {
      status: 'materials_sent',
    });
    return { statusCode: STATUS_CODES.OK, data: { order } };
  }

  async startProduction(id: string): Promise<APIResponse> {
    await this.checkTransition(id, 'in_production', {
      allowedFrom: ['materials_sent'],
    });
    const order = await this.manufacturingOrdersRepo.updateOrder(id, {
      status: 'in_production',
    });
    return { statusCode: STATUS_CODES.OK, data: { order } };
  }
  async complete(id: string): Promise<APIResponse> {
    await this.checkTransition(id, 'completed', {
      allowedFrom: ['in_production'],
    });
    const order = await this.manufacturingOrdersRepo.updateOrder(id, {
      status: 'completed',
    });
    return { statusCode: STATUS_CODES.OK, data: { order } };
  }

  async cancel(id: string): Promise<APIResponse> {
    await this.checkTransition(id, 'cancelled', {
      blockedFrom: MFG_ORDER_NON_CANCELLABLE,
    });
    const order = await this.manufacturingOrdersRepo.updateOrder(id, {
      status: 'cancelled',
    });
    return { statusCode: STATUS_CODES.OK, data: { order } };
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

  private async checkMaterialsStock(
    materials: { materialId: string; quantity: number }[],
  ) {
    const ids = materials.map((m) => m.materialId);
    const stocks = await this.inventoryRepo.findByMaterialIds(ids);

    const insufficient = materials.filter((m) => {
      const stock = stocks.find((s) => s.itemId === m.materialId);
      return !stock || stock.quantity < m.quantity;
    });

    console.log('required:', materials);
    console.log('found stocks:', stocks); // 👈 add this

    if (insufficient.length)
      throw new APIError(
        `Insufficient stock for materials: ${insufficient.map((m) => m.materialId).join(', ')}`,
        STATUS_CODES.Conflict,
      );
  }

  private async checkTransition(
    id: string,
    to: ManufacturingOrderStatus,
    opts: {
      allowedFrom?: ManufacturingOrderStatus[];
      blockedFrom?: ManufacturingOrderStatus[];
    },
  ) {
    const order = await this.checkExistingManufacturingOrder(id);

    if (opts.allowedFrom && !opts.allowedFrom.includes(order.status))
      throw new APIError(
        `Order cannot be ${to} from status: "${order.status}".`,
        STATUS_CODES.Conflict,
      );

    if (opts.blockedFrom && opts.blockedFrom.includes(order.status))
      throw new APIError(
        `Order cannot be ${to} when status is "${order.status}".`,
        STATUS_CODES.Conflict,
      );
  }
}
