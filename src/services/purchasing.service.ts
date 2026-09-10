import {
  IItemsRepository,
  IPurchasingService,
  IBranchesRepository,
  ISuppliersRepository,
  IPurchaseRequestsRepository,
  ISupplierQuotationsRepository,
  IItemSuppliersRepository,
  IPurchaseOrdersRepository,
} from '../interfaces';
import { db } from '../config/drizzle';
import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { AuthenticatedUser, PurchaseOrder } from '../types/app.types';
import { CreatePurchaseOrderDto } from '../dtos/purchasing/createPurchaseOrder.dto';
import { FilterPurchaseOrdersDto } from '../dtos/purchasing/filterPurchaseOrders.dto';
import { CreatePurchaseRequestDto } from '../dtos/purchasing/createPurchaseRequest.dto';
import { RejectPurchaseRequestDto } from '../dtos/purchasing/rejectPurchaseRequest.dto';
import { FilterPurchaseRequestsDto } from '../dtos/purchasing/filterPurchaseRequests.dto';
import { CreateSupplierQuotationDto } from '../dtos/purchasing/createSupplierQuotation.dto';
import { PurchaseOrderStatus } from '../../drizzle/schema';
import { PURCH_ORDS_VALID_TRANSITIONS } from '../constants/purchaseOrder.constants';

export class PurchasingService implements IPurchasingService {
  constructor(
    private readonly purchaseReqsRepo: IPurchaseRequestsRepository,
    private readonly itemsRepo: IItemsRepository,
    private readonly branchesRepo: IBranchesRepository,
    private readonly supplierQuotationsRepo: ISupplierQuotationsRepository,
    private readonly suppliersRepo: ISuppliersRepository,
    private readonly itemSuppliersRepo: IItemSuppliersRepository,
    private readonly purchaseOrdersRepo: IPurchaseOrdersRepository,
  ) {}

  async createPurchaseRequest(
    ordererId: string,
    dto: CreatePurchaseRequestDto,
  ) {
    const { items, ...requestData } = dto;

    const [branch] = await Promise.all([
      this.branchesRepo.getById(dto.branchId),
      this.checkItems(items.map((i) => i.itemId)),
    ]);

    if (!branch)
      throw new APIError('No branch found with this id', STATUS_CODES.NotFound);

    await db.transaction(async (tx) => {
      const request = await this.purchaseReqsRepo.createReq(
        { ...requestData, ordererId },
        tx,
      );

      await this.purchaseReqsRepo.createManyItems(
        items.map((item) => ({ ...item, purchaseRequestId: request.id })),
        tx,
      );
    });

    return {
      statusCode: STATUS_CODES.Created,
      message: 'Purchase request created successfully.',
    };
  }

  async getAllPurchaseRequests(
    user: AuthenticatedUser,
    page: number,
    limit: number,
    q: FilterPurchaseRequestsDto,
  ) {
    if (user.role.role === 'branch_admin') {
      if (q.branchId && q.branchId !== user.branchId)
        throw new APIError(
          'You can only view your own branch purchase requests',
          STATUS_CODES.Forbidden,
        );

      q.branchId = user.branchId;
    }

    const requests = await this.purchaseReqsRepo.getAllPurchaseRequests(
      page,
      limit,
      q,
    );

    return {
      statusCode: STATUS_CODES.OK,
      size: requests.length,
      data: requests,
    };
  }

  async getPurchaseRequest(user: AuthenticatedUser, purchaseRequestId: string) {
    const request = await this.checkExistingPurchReq(purchaseRequestId);
    this.checkBranchAccess(user, request.branchId, 'view');

    return { statusCode: STATUS_CODES.OK, data: request };
  }

  async approvePurchaseRequest(user: AuthenticatedUser, id: string) {
    const request = await this.checkExistingPurchReq(id);
    this.checkBranchAccess(user, request.branchId, 'approve');

    if (request.status !== 'pending')
      throw new APIError(
        'Only pending requests can be approved',
        STATUS_CODES.BadRequest,
      );

    const updated = await this.purchaseReqsRepo.updateReqStatus(id, {
      status: 'approved',
      reviewerId: user.id,
      reviewDate: new Date(),
    });

    return { statusCode: STATUS_CODES.OK, data: updated };
  }

  async rejectPurchaseRequest(
    user: AuthenticatedUser,
    id: string,
    dto: RejectPurchaseRequestDto,
  ) {
    const request = await this.checkExistingPurchReq(id);
    this.checkBranchAccess(user, request.branchId, 'reject');

    if (request.status !== 'pending')
      throw new APIError(
        'Only pending requests can be rejected',
        STATUS_CODES.BadRequest,
      );

    const updated = await this.purchaseReqsRepo.updateReqStatus(id, {
      status: 'rejected',
      reviewerId: user.id,
      reviewDate: new Date(),
      rejectionReason: dto.rejectionReason,
    });

    return { statusCode: STATUS_CODES.OK, data: updated };
  }

  async createSupplierQuotation(
    purchaseRequestId: string,
    dto: CreateSupplierQuotationDto,
  ) {
    const { items, ...quotationData } = dto;

    const [request] = await Promise.all([
      this.checkExistingPurchReq(purchaseRequestId),
      this.checkExistingSupplier(dto.supplierId),
    ]);

    if (request.status !== 'approved')
      throw new APIError(
        'Quotations can only be submitted for approved requests',
        STATUS_CODES.BadRequest,
      );

    await this.checkSupplierItems(
      dto.supplierId,
      items.map((i) => i.itemId),
    );

    await db.transaction(async (tx) => {
      const quotation = await this.supplierQuotationsRepo.createQuotation(
        { ...quotationData, purchaseRequestId },
        tx,
      );

      await this.supplierQuotationsRepo.createManyItems(
        items.map((item) => ({ ...item, quotationId: quotation.id })),
        tx,
      );
    });

    return {
      statusCode: STATUS_CODES.Created,
      message: 'Supplier Quotation created successfully.',
    };
  }

  async getPurchReqQuotations(
    user: AuthenticatedUser,
    purchaseRequestId: string,
    page: number,
    limit: number,
  ) {
    const purchaseRequest = await this.checkExistingPurchReq(purchaseRequestId);
    this.checkBranchAccess(user, purchaseRequest.branchId, 'access');

    const quots = await this.supplierQuotationsRepo.getPurchReqQuotations(
      purchaseRequestId,
      page,
      limit,
    );

    return {
      statusCode: STATUS_CODES.OK,
      size: quots.length,
      data: quots,
    };
  }

  async getQuotation(
    user: AuthenticatedUser,
    purchaseRequestId: string,
    quotationId: string,
  ) {
    const quot = await this.checkExistingQuotation(quotationId);
    const { purchaseRequest, ...quotData } = quot;
    this.checkBranchAccess(user, purchaseRequest.branchId, 'access');

    if (quot.purchaseRequestId !== purchaseRequestId)
      throw new APIError(
        'The quotation does not belong to the purchase request',
        STATUS_CODES.BadRequest,
      );

    return {
      statusCode: STATUS_CODES.OK,
      data: quotData,
    };
  }

  async createPurchaseOrder(createdById: string, dto: CreatePurchaseOrderDto) {
    const quotation = await this.checkExistingQuotation(dto.quotationId);
    const existingOrder = await this.purchaseOrdersRepo.getOrderByQuotationId(
      dto.quotationId,
    );
    if (existingOrder)
      throw new APIError(
        'A purchase order already exists for this quotation',
        STATUS_CODES.Conflict,
      );

    if (quotation.validUntil < new Date().toISOString().split('T')[0])
      throw new APIError('This quotation has expired', STATUS_CODES.BadRequest);

    const totalPrice = quotation.items
      .reduce(
        (sum, item) => sum + item.quantity * parseFloat(item.unitPrice),
        0,
      )
      .toFixed(2);

    await db.transaction(async (tx) => {
      const order = await this.purchaseOrdersRepo.createOrder(
        {
          quotationId: quotation.id,
          supplierId: quotation.supplierId,
          branchId: quotation.purchaseRequest.branchId,
          totalPrice,
          createdById,
        },
        tx,
      );

      await this.purchaseOrdersRepo.createManyItems(
        quotation.items.map((item) => ({
          orderId: order.id,
          itemId: item.itemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        tx,
      );
    });

    return {
      statusCode: STATUS_CODES.Created,
      message: 'Purchase order created successfully.',
    };
  }

  async getAllPurchaseOrders(
    user: AuthenticatedUser,
    page: number,
    limit: number,
    q: FilterPurchaseOrdersDto,
  ) {
    if (user.role.role === 'branch_admin') {
      if (q.branchId && q.branchId !== user.branchId)
        throw new APIError(
          'You can only view your own branch orders',
          STATUS_CODES.Forbidden,
        );
      q.branchId = user.branchId;
    }

    const orders = await this.purchaseOrdersRepo.getAllOrders(page, limit, q);

    return {
      statusCode: STATUS_CODES.OK,
      size: orders.length,
      data: orders,
    };
  }

  async getPurchaseOrder(user: AuthenticatedUser, id: string) {
    const order = await this.checkExistingPurchOrder(id);
    this.checkBranchAccess(user, order.branchId, 'view');

    return { statusCode: STATUS_CODES.OK, data: order };
  }

  async approvePurchaseOrder(user: AuthenticatedUser, id: string) {
    const order = await this.checkExistingPurchOrder(id);
    this.checkBranchAccess(user, order.branchId, 'approve');
    return this.transitionOrder(id, 'approved', { approvedById: user.id });
  }

  async shipPurchaseOrder(id: string) {
    return this.transitionOrder(id, 'shipped');
  }

  async deliverPurchaseOrder(id: string) {
    return this.transitionOrder(id, 'delivered', {
      actualDeliveryDate: new Date().toISOString().split('T')[0],
    });
  }

  async cancelPurchaseOrder(user: AuthenticatedUser, id: string) {
    const order = await this.checkExistingPurchOrder(id);
    this.checkBranchAccess(user, order.branchId, 'cancel');

    if (order.status === 'cancelled')
      throw new APIError(
        'This purchase order is already cancelled',
        STATUS_CODES.Conflict,
      );
    if (order.status === 'delivered')
      throw new APIError(
        'You cannot cancel a delivered purchase order',
        STATUS_CODES.BadRequest,
      );

    const updatedOrder = await this.purchaseOrdersRepo.updateOrder(id, {
      status: 'cancelled',
    });
    return { statusCode: STATUS_CODES.OK, data: updatedOrder };
  }

  // ---- Helpers ----
  private async transitionOrder(
    id: string,
    to: PurchaseOrderStatus,
    data?: Partial<PurchaseOrder>,
  ) {
    const order = await this.checkExistingPurchOrder(id);
    const validNext = PURCH_ORDS_VALID_TRANSITIONS[order.status];

    if (validNext !== to)
      throw new APIError(
        `Cannot transition order from "${order.status}" to "${to}"`,
        STATUS_CODES.BadRequest,
      );

    const updatedOrder = await this.purchaseOrdersRepo.updateOrder(id, {
      status: to,
      ...data,
    });
    return { statusCode: STATUS_CODES.OK, data: updatedOrder };
  }

  private async checkItems(ids: string[]) {
    const foundItems = await this.itemsRepo.findManyByIds(ids);

    if (foundItems.length !== ids.length)
      throw new APIError(
        'One or more items do not exist',
        STATUS_CODES.NotFound,
      );
  }

  private async checkSupplierItems(supplierId: string, itemIds: string[]) {
    const supplierItems =
      await this.itemSuppliersRepo.findManyBySupplierAndItems(
        supplierId,
        itemIds,
      );

    if (supplierItems.length !== itemIds.length)
      throw new APIError(
        'One or more items are not provided by this supplier',
        STATUS_CODES.BadRequest,
      );
  }

  private async checkExistingPurchReq(id: string) {
    const request = await this.purchaseReqsRepo.findReq(id);
    if (!request)
      throw new APIError(
        'No purchase request found with this id',
        STATUS_CODES.NotFound,
      );

    return request;
  }

  private async checkExistingQuotation(id: string) {
    const quot = await this.supplierQuotationsRepo.getQuotation(id);
    if (!quot)
      throw new APIError(
        'No quotation found with this id',
        STATUS_CODES.NotFound,
      );

    return quot;
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

  private async checkExistingSupplier(id: string) {
    const supplier = await this.suppliersRepo.findOne(id);
    if (!supplier)
      throw new APIError(
        'No supplier found with this id',
        STATUS_CODES.NotFound,
      );

    return supplier;
  }

  private checkBranchAccess(
    user: AuthenticatedUser,
    branchId: string,
    action: string,
  ) {
    if (user.role.role === 'branch_admin' && branchId !== user.branchId)
      throw new APIError(
        `You can only ${action} your own branch requests`,
        STATUS_CODES.Forbidden,
      );
  }
}
