import {
  IItemsRepository,
  IPurchasingService,
  IBranchesRepository,
  IPurchaseRequestsRepository,
} from '../interfaces';
import { db } from '../config/drizzle';
import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';
import { CreatePurchaseRequestDto } from '../dtos/purchasing/createPurchaseRequest.dto';
import { FilterPurchaseRequestsDto } from '../dtos/purchasing/filterPurchaseRequests.dto';
import { AuthenticatedUser } from '../types/app.types';

export class PurchasingService implements IPurchasingService {
  constructor(
    private readonly purchaseReqsRepo: IPurchaseRequestsRepository,
    private readonly itemsRepo: IItemsRepository,
    private readonly branchesRepo: IBranchesRepository,
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
      statusCode: STATUS_CODES.OK,
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
    const request = await this.purchaseReqsRepo.findReq(purchaseRequestId);
    if (!request)
      throw new APIError(
        'No purchase request found with this id',
        STATUS_CODES.NotFound,
      );

    if (user.role.role === 'branch_admin' && request.branchId !== user.branchId)
      throw new APIError(
        'You can only view your own branch purchase requests',
        STATUS_CODES.Forbidden,
      );

    return { statusCode: STATUS_CODES.OK, data: request };
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
}
