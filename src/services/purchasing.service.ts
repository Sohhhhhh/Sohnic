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
