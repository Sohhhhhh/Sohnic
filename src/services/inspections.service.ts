import {
  IInspectionsRepository,
  IInspectionsService,
  IItemsRepository,
  IPurchaseOrdersRepository,
} from '../interfaces';
import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';
import { AuthenticatedUser } from '../types/app.types';
import { CreateInspectionDto } from '../dtos/inspections/createInspection.dto';
import { FilterInspectionsDto } from '../dtos/inspections/filterInspections.dto';

export class InspectionsService implements IInspectionsService {
  constructor(
    private readonly inspectionsRepo: IInspectionsRepository,
    private readonly itemsRepo: IItemsRepository,
    private readonly purchaseOrdersRepo: IPurchaseOrdersRepository,
    // add both manufacturing and transfers
  ) {}

  async create(inspectorId: string, dto: CreateInspectionDto) {
    let branchId = '';

    await this.checkExistingItem(dto.itemId);
    switch (dto.type) {
      case 'order': {
        const order = await this.checkExistingPurchOrder(
          dto.orderId,
          dto.itemId,
        );
        branchId = order.branchId;
        break;
      }
      case 'manufacturing_batch': {
        await this.checkExistingManufacturingBatch(dto.manufacturingBatchId);
        // branchId = batch.manufacturingOrder.branchId;
        break;
      }
      case 'transfer': {
        await this.checkExistingTransferOrder(dto.transferOrderId);
        // branchId = transferOrder.transferRequest.requestedByBranch;
        break;
      }
    }

    const inspection = await this.inspectionsRepo.create({
      branchId,
      inspectorId,
      ...dto,
    });
    return { statusCode: STATUS_CODES.Created, data: inspection };
  }

  async getAll(
    user: AuthenticatedUser,
    page: number,
    limit: number,
    q: FilterInspectionsDto,
  ) {
    if (user.role.role === 'branch_admin') {
      if (q.branchId && q.branchId !== user.branchId)
        throw new APIError(
          'You can only view your own branch inspections',
          STATUS_CODES.Forbidden,
        );
      q.branchId = user.branchId;
    }

    const inspections = await this.inspectionsRepo.getAll(page, limit, q);

    return {
      statusCode: STATUS_CODES.OK,
      size: inspections.length,
      data: inspections,
    };
  }

  async getOne(user: AuthenticatedUser, inspectionId: string) {
    const inspection = await this.checkExistingInspection(inspectionId);
    this.checkBranchAccess(user, inspection.branchId);

    return { statusCode: STATUS_CODES.Created, data: inspection };
  }

  // ---- Helpers ----

  private async checkExistingInspection(id: string) {
    const inspection = await this.inspectionsRepo.getOne(id);
    if (!inspection)
      throw new APIError(
        `No inspection found with this id`,
        STATUS_CODES.NotFound,
      );

    return inspection;
  }

  private async checkExistingItem(id: string) {
    const item = await this.itemsRepo.findOne(id);
    if (!item)
      throw new APIError(`No item found with this id`, STATUS_CODES.NotFound);

    return item;
  }

  private async checkExistingPurchOrder(id: string, itemId: string) {
    const order = await this.purchaseOrdersRepo.getOrder(id);
    if (!order)
      throw new APIError(
        'No purchase order found with this id',
        STATUS_CODES.NotFound,
      );

    const isItemInOrder = order.items.some((item) => item.itemId === itemId);

    if (!isItemInOrder) {
      throw new APIError(
        'The specified item does not exist in this purchase order',
        STATUS_CODES.BadRequest,
      );
    }

    return order;
  }

  private async checkExistingManufacturingBatch(id: string) {
    return true;
  }

  private async checkExistingTransferOrder(id: string) {
    return false;
  }

  private checkBranchAccess(user: AuthenticatedUser, branchId: string) {
    if (user.role.role === 'branch_admin' && branchId !== user.branchId)
      throw new APIError(
        `You can only access your own branch inspections`,
        STATUS_CODES.Forbidden,
      );
  }
}
