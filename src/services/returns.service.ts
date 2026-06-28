import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';
import {
  IInspectionsRepository,
  IPurchaseOrdersRepository,
  IReturnsService,
  ISupplierReturnsRepository,
} from '../interfaces';
import { CreateSupplierReturnDto } from '../dtos/returns/supplier-returns/createSupplierReturn.dto';
import { FilterSupplierReturnsDto } from '../dtos/returns/supplier-returns/filterSupplierReturns.dto';

export class ReturnsService implements IReturnsService {
  constructor(
    private readonly supplierReturnsRepo: ISupplierReturnsRepository,
    private readonly inspectionsRepo: IInspectionsRepository,
    private readonly purchaseOrdersRepo: IPurchaseOrdersRepository,
  ) {}

  async createSupplierReturn(dto: CreateSupplierReturnDto) {
    const inspection = await this.checkExistingInspection(dto.inspectionId);

    if (inspection.type !== 'order')
      throw new APIError(
        'Inspection must be for a purchase order',
        STATUS_CODES.BadRequest,
      );

    if (inspection.inspectionResult === 'passed')
      throw new APIError(
        'Cannot create return for passed inspection',
        STATUS_CODES.BadRequest,
      );

    const order = await this.checkExistingPurchOrder(inspection.orderId!);

    const supplierReturn = await this.supplierReturnsRepo.createSupplierReturn({
      reason: dto.reason,
      itemId: inspection.itemId,
      supplierId: order.supplierId,
      inspectionId: dto.inspectionId,
      inspectorId: inspection.inspectorId,
      purchaseOrderId: inspection.orderId!,
      quantity: inspection.quantityRejected,
    });

    return {
      statusCode: STATUS_CODES.Created,
      data: supplierReturn,
    };
  }

  async getAllSupplierReturns(
    page: number,
    limit: number,
    q?: FilterSupplierReturnsDto,
  ) {
    const supplierReturns =
      await this.supplierReturnsRepo.getAllSupplierReturns(page, limit, q);

    return {
      statusCode: STATUS_CODES.OK,
      size: supplierReturns.length,
      data: supplierReturns,
    };
  }

  // --- Helpers ---

  private async checkExistingInspection(id: string) {
    const inspection = await this.inspectionsRepo.getOne(id);
    if (!inspection)
      throw new APIError(
        `No inspection found with this id`,
        STATUS_CODES.NotFound,
      );

    return inspection;
  }

  private async checkExistingPurchOrder(id: string) {
    const order = await this.purchaseOrdersRepo.getOrder(id);
    if (!order)
      throw new APIError(
        'No purchase order found with this id',
        STATUS_CODES.NotFound,
      );

    return order;
  }
}
