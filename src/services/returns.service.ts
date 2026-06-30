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
import { SupplierReturn } from '../types/app.types';
import { RETURN_REQS_VALID_TRANSITIONS } from '../constants/purchaseOrder.constants';
import { ReturnRequestStatus } from '../../drizzle/schema';

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

  async getOneSupplierReturn(id: string) {
    const supplierReturn = await this.checkExistingSupplierReturn(id);

    return {
      statusCode: STATUS_CODES.OK,
      data: supplierReturn,
    };
  }

  async acceptSupplierReturn(userId: string, id: string) {
    await this.transitionReturn(id, 'approved', { approvedById: userId });

    return {
      statusCode: STATUS_CODES.OK,
      message: `Return request approved successfully`,
    };
  }

  async completeSupplierReturn(id: string) {
    await this.transitionReturn(id, 'completed');

    return {
      statusCode: STATUS_CODES.OK,
      message: `Return request completed successfully`,
    };
  }

  // --- Helpers ---
  private async transitionReturn(
    id: string,
    to: ReturnRequestStatus,
    data?: Partial<SupplierReturn>,
  ) {
    const supplierReturn = await this.checkExistingSupplierReturn(id);
    const validNext = RETURN_REQS_VALID_TRANSITIONS[supplierReturn.status];

    if (validNext !== to)
      throw new APIError(
        `Cannot transition return request from "${supplierReturn.status}" to "${to}"`,
        STATUS_CODES.BadRequest,
      );

    await this.supplierReturnsRepo.updateSupplierReturn(id, {
      status: to,
      ...data,
    });
  }

  private async checkExistingSupplierReturn(id: string) {
    const supplierReturn =
      await this.supplierReturnsRepo.getOneSupplierReturn(id);
    if (!supplierReturn)
      throw new APIError(
        `No supplier return found with this id`,
        STATUS_CODES.NotFound,
      );

    return supplierReturn;
  }

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
