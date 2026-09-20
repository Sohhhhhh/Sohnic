import { CreateTransferRequestDto } from '../dtos/transfers/createTransferRequest.dto';
import { FilterTransferRequestsDto } from '../dtos/transfers/filterTransferRequests.dto';
import { ApproveTransferRequestDto } from '../dtos/transfers/approveTransferRequest.dto';
import { RejectTransferRequestDto } from '../dtos/transfers/rejectTransferRequest.dto';
import { ReceiveTransferRequestDto } from '../dtos/transfers/receiveTransferRequest.dto';
import {
  IItemsRepository,
  IInventoryRepository,
  IInspectionsRepository,
  ITransfersRepository,
  ITransfersService,
  IBranchesRepository,
} from '../interfaces';
import { STATUS_CODES } from '../utils/statusCodes';
import {
  AuthenticatedUser,
  TransferRequest,
  TransferRequestWithItems,
} from '../types/app.types';
import { TransferRequestStatus } from '../../drizzle/schema';
import { TRANSFER_REQ_NON_CANCELLABLE } from '../constants/transferRequests.constants';
import APIError from '../utils/APIError';
import { db } from '../config/drizzle';

export class TransfersService implements ITransfersService {
  constructor(
    private readonly transfersRepo: ITransfersRepository,
    private readonly itemsRepo: IItemsRepository,
    private readonly branchesRepo: IBranchesRepository,
    private readonly inventoryRepo: IInventoryRepository,
    private readonly inspectionsRepo: IInspectionsRepository,
  ) {}

  async create(user: AuthenticatedUser, dto: CreateTransferRequestDto) {
    const { items, ...requestData } = dto;
    const { requestedFromBranch, requestedByBranch } = requestData;

    await Promise.all([
      this.checkBranch(requestedByBranch),
      this.checkItems(items.map((i) => i.itemId)),
      this.checkFromBranchIsMain(requestedFromBranch),
    ]);

    this.checkBranchAccess(user, requestedByBranch);

    await db.transaction(async (tx) => {
      const request = await this.transfersRepo.create(
        { ...requestData, createdById: user.id },
        tx,
      );

      await this.transfersRepo.createManyItems(
        items.map((item) => ({ ...item, transferRequestId: request.id })),
        tx,
      );
    });

    return {
      statusCode: STATUS_CODES.Created,
      message: 'Transfer request created successfully.',
    };
  }

  async findAll(
    user: AuthenticatedUser,
    page: number,
    limit: number,
    q: FilterTransferRequestsDto,
  ) {
    if (user.role.role === 'branch_admin') {
      if (q.byBranch && q.byBranch !== user.branchId)
        throw new APIError(
          'You can only view your own branch transfer requests',
          STATUS_CODES.Forbidden,
        );

      q.byBranch = user.branchId;
    }

    const requests = await this.transfersRepo.findAll(page, limit, q);

    return {
      statusCode: STATUS_CODES.OK,
      size: requests.length,
      data: requests,
    };
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const request = await this.checkExistingTransfer(id);
    this.checkViewAccess(user, request);

    return { statusCode: STATUS_CODES.OK, data: request };
  }

  async approve(
    user: AuthenticatedUser,
    id: string,
    dto: ApproveTransferRequestDto,
  ) {
    const request = await this.checkTransition(id, 'approved', {
      allowedFrom: ['pending'],
    });
    this.checkMainBranchAccess(user, request);

    const approvedQuantities = this.resolveApprovedQuantities(
      request,
      dto.items,
    );

    const updated = await db.transaction(async (tx) => {
      await Promise.all(
        approvedQuantities.map(({ itemId, quantityApproved }) =>
          this.transfersRepo.updateRequestItem(
            id,
            itemId,
            { quantityApproved },
            tx,
          ),
        ),
      );

      return this.transfersRepo.updateRequest(
        id,
        { status: 'approved', approvedById: user.id, approvedAt: new Date() },
        tx,
      );
    });

    return { statusCode: STATUS_CODES.OK, data: updated };
  }

  async reject(
    user: AuthenticatedUser,
    id: string,
    dto: RejectTransferRequestDto,
  ) {
    const request = await this.checkTransition(id, 'rejected', {
      allowedFrom: ['pending'],
    });
    this.checkMainBranchAccess(user, request);

    const updated = await this.transfersRepo.updateRequest(id, {
      status: 'rejected',
      rejectionReason: dto.rejectionReason,
    });

    return { statusCode: STATUS_CODES.OK, data: updated };
  }

  async dispatch(user: AuthenticatedUser, id: string) {
    const request = await this.checkTransition(id, 'in_transit', {
      allowedFrom: ['approved'],
    });
    this.checkMainBranchAccess(user, request);

    const items = request.items.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantityApproved ?? item.quantityRequested,
    }));
    await this.checkMainStock(items);

    const updated = await db.transaction(async (tx) => {
      await this.inventoryRepo.deductStockBatch(items, tx);

      return this.transfersRepo.updateRequest(
        id,
        {
          status: 'in_transit',
          dispatchedById: user.id,
          dispatchedAt: new Date(),
        },
        tx,
      );
    });

    return { statusCode: STATUS_CODES.OK, data: updated };
  }

  async receive(
    user: AuthenticatedUser,
    id: string,
    dto: ReceiveTransferRequestDto,
  ) {
    const request = await this.checkTransition(id, 'received', {
      allowedFrom: ['in_transit'],
    });
    this.checkBranchAccess(user, request.requestedByBranch);

    const receivedQuantities = this.resolveReceivedQuantities(
      request,
      dto.items,
    );

    const warehouse = await this.checkWarehouse(request.requestedByBranch);

    const updated = await db.transaction(async (tx) => {
      await Promise.all(
        receivedQuantities.flatMap(({ itemId, quantityReceived }) => [
          this.transfersRepo.updateRequestItem(
            id,
            itemId,
            { quantityReceived },
            tx,
          ),
          this.inventoryRepo.upsert(itemId, warehouse.id, quantityReceived, tx),
        ]),
      );

      return this.transfersRepo.updateRequest(
        id,
        { status: 'received', deliveredAt: new Date() },
        tx,
      );
    });

    return { statusCode: STATUS_CODES.OK, data: updated };
  }

  async complete(user: AuthenticatedUser, id: string) {
    const request = await this.checkTransition(id, 'completed', {
      allowedFrom: ['received'],
    });
    this.checkViewAccess(user, request);

    await this.checkAllItemsInspected(
      id,
      request.items.map((i) => i.itemId),
    );

    const updated = await this.transfersRepo.updateRequest(id, {
      status: 'completed',
    });

    return { statusCode: STATUS_CODES.OK, data: updated };
  }

  async cancel(user: AuthenticatedUser, id: string) {
    const request = await this.checkTransition(id, 'cancelled', {
      blockedFrom: TRANSFER_REQ_NON_CANCELLABLE,
    });
    this.checkViewAccess(user, request);

    const updated = await this.transfersRepo.updateRequest(id, {
      status: 'cancelled',
    });

    return { statusCode: STATUS_CODES.OK, data: updated };
  }

  // ---- Helpers ----

  private async checkItems(ids: string[]) {
    const foundItems = await this.itemsRepo.findManyByIds(ids);

    if (foundItems.length !== ids.length)
      throw new APIError(
        'One or more items do not exist',
        STATUS_CODES.NotFound,
      );
  }

  private async checkBranch(branchId: string) {
    const branch = await this.branchesRepo.getById(branchId);

    if (!branch)
      throw new APIError(
        `No branch found with this Id: ${branchId}`,
        STATUS_CODES.NotFound,
      );
  }

  private async checkFromBranchIsMain(branchId: string) {
    const branch = await this.branchesRepo.getById(branchId);

    if (!branch)
      throw new APIError(
        `No branch found with this Id: ${branchId}`,
        STATUS_CODES.NotFound,
      );

    if (branch.type !== 'main')
      throw new APIError(
        'You can only request inventory from the main branch',
        STATUS_CODES.BadRequest,
      );
  }

  private async checkExistingTransfer(id: string) {
    const request = await this.transfersRepo.findOne(id);

    if (!request)
      throw new APIError(
        'No transfer request found with this id',
        STATUS_CODES.NotFound,
      );

    return request;
  }

  private checkViewAccess(user: AuthenticatedUser, request: TransferRequest) {
    if (
      user.role.role === 'branch_admin' &&
      request.requestedByBranch !== user.branchId &&
      request.requestedFromBranch !== user.branchId
    )
      throw new APIError(
        'You can only view your own branch transfer requests',
        STATUS_CODES.Forbidden,
      );
  }

  private checkMainBranchAccess(
    user: AuthenticatedUser,
    request: TransferRequest,
  ) {
    if (
      user.role.role === 'branch_admin' &&
      request.requestedFromBranch !== user.branchId
    )
      throw new APIError(
        'Only the main branch can perform this action',
        STATUS_CODES.Forbidden,
      );
  }

  private async checkWarehouse(branchId: string) {
    const warehouse = await this.inventoryRepo.getWarehouseByBranchId(branchId);

    if (!warehouse)
      throw new APIError(
        'No warehouse found for this branch.',
        STATUS_CODES.NotFound,
      );

    return warehouse;
  }

  private checkBranchAccess(user: AuthenticatedUser, branchId: string) {
    if (user.role.role === 'branch_admin' && branchId !== user.branchId)
      throw new APIError(
        `You can only send/accept your own branch's requests`,
        STATUS_CODES.Forbidden,
      );
  }

  private async checkTransition(
    id: string,
    to: TransferRequestStatus,
    opts: {
      allowedFrom?: TransferRequestStatus[];
      blockedFrom?: TransferRequestStatus[];
    },
  ) {
    const request = await this.checkExistingTransfer(id);

    if (opts.allowedFrom && !opts.allowedFrom.includes(request.status))
      throw new APIError(
        `Transfer request cannot be ${to} from status: "${request.status}".`,
        STATUS_CODES.Conflict,
      );

    if (opts.blockedFrom && opts.blockedFrom.includes(request.status))
      throw new APIError(
        `Transfer request cannot be ${to} when status is "${request.status}".`,
        STATUS_CODES.Conflict,
      );

    return request;
  }

  private resolveApprovedQuantities(
    request: TransferRequestWithItems,
    overrides?: { itemId: string; quantityApproved: number }[],
  ) {
    const overridesByItem = new Map(
      (overrides ?? []).map((o) => [o.itemId, o.quantityApproved]),
    );

    for (const itemId of overridesByItem.keys()) {
      if (!request.items.some((i) => i.itemId === itemId))
        throw new APIError(
          'One or more items do not belong to this transfer request',
          STATUS_CODES.BadRequest,
        );
    }

    return request.items.map((item) => {
      const quantityApproved =
        overridesByItem.get(item.itemId) ?? item.quantityRequested;

      if (quantityApproved > item.quantityRequested)
        throw new APIError(
          'Approved quantity cannot exceed requested quantity',
          STATUS_CODES.BadRequest,
        );

      return { itemId: item.itemId, quantityApproved };
    });
  }

  private resolveReceivedQuantities(
    request: TransferRequestWithItems,
    overrides?: { itemId: string; quantityReceived: number }[],
  ) {
    const overridesByItem = new Map(
      (overrides ?? []).map((o) => [o.itemId, o.quantityReceived]),
    );

    for (const itemId of overridesByItem.keys()) {
      if (!request.items.some((i) => i.itemId === itemId))
        throw new APIError(
          'One or more items do not belong to this transfer request',
          STATUS_CODES.BadRequest,
        );
    }

    return request.items.map((item) => {
      const approved = item.quantityApproved ?? item.quantityRequested;
      const quantityReceived = overridesByItem.get(item.itemId) ?? approved;

      if (quantityReceived > approved)
        throw new APIError(
          'Received quantity cannot exceed approved quantity',
          STATUS_CODES.BadRequest,
        );

      return { itemId: item.itemId, quantityReceived };
    });
  }

  private async checkMainStock(items: { itemId: string; quantity: number }[]) {
    const stocks = await this.inventoryRepo.findByItemIds(
      items.map((i) => i.itemId),
    );

    const insufficient = items.filter((i) => {
      const stock = stocks.find((s) => s.itemId === i.itemId);
      return !stock || stock.quantity < i.quantity;
    });

    if (insufficient.length)
      throw new APIError(
        `Insufficient stock for items: ${insufficient.map((i) => i.itemId).join(', ')}`,
        STATUS_CODES.Conflict,
      );
  }

  private async checkAllItemsInspected(requestId: string, itemIds: string[]) {
    const passed =
      await this.inspectionsRepo.findPassedByTransferRequest(requestId);
    const passedIds = new Set(passed.map((i) => i.itemId));

    if (!itemIds.every((id) => passedIds.has(id)))
      throw new APIError(
        'Transfer cannot be completed until all items pass inspection',
        STATUS_CODES.Conflict,
      );
  }
}
