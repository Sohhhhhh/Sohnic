import { CreateTransferRequestDto } from '../dtos/transfers/createTransferRequest.dto';
import {
  IItemsRepository,
  ITransfersRepository,
  ITransfersService,
  IBranchesRepository,
} from '../interfaces';
import { STATUS_CODES } from '../utils/statusCodes';
import { AuthenticatedUser } from '../types/app.types';
import APIError from '../utils/APIError';
import { db } from '../config/drizzle';

export class TransfersService implements ITransfersService {
  constructor(
    private readonly trnsfersRepo: ITransfersRepository,
    private readonly itemsRepo: IItemsRepository,
    private readonly branchesRepo: IBranchesRepository,
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
      const request = await this.trnsfersRepo.create(
        { ...requestData, createdById: user.id },
        tx,
      );

      await this.trnsfersRepo.createManyItems(
        items.map((item) => ({ ...item, transferRequestId: request.id })),
        tx,
      );
    });

    return {
      statusCode: STATUS_CODES.Created,
      message: 'Transfer request created successfully.',
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

  private checkBranchAccess(user: AuthenticatedUser, branchId: string) {
    if (user.role.role === 'branch_admin' && branchId !== user.branchId)
      throw new APIError(
        `You can only send/accept your own branch's requests`,
        STATUS_CODES.Forbidden,
      );
  }
}
