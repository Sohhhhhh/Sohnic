import APIError from '../utils/APIError';
import {
  IInspectionsRepository,
  IReturnsRepository,
  IReturnsService,
} from '../interfaces';
import { Return } from '../types/app.types';
import { STATUS_CODES } from '../utils/statusCodes';
import { ReturnRequestStatus } from '../../drizzle/schema';
import { CreateReturnDto } from '../dtos/returns/createReturn.dto';
import { FilterReturnsDto } from '../dtos/returns/filterReturns.dto';
import { RETURN_REQS_VALID_TRANSITIONS } from '../constants/purchaseOrder.constants';

export class ReturnsService implements IReturnsService {
  constructor(
    private readonly returnsRepo: IReturnsRepository,
    private readonly inspectionsRepo: IInspectionsRepository,
  ) {}

  async create(dto: CreateReturnDto) {
    const inspection = await this.checkExistingInspection(dto.inspectionId);

    if (inspection.inspectionResult === 'passed')
      throw new APIError(
        'Cannot create return for passed inspection',
        STATUS_CODES.BadRequest,
      );

    const type =
      inspection.type === 'order'
        ? 'supplier'
        : inspection.type === 'manufacturing_batch'
          ? 'manufacturer'
          : 'transfer';

    const ret = await this.returnsRepo.create({
      type,
      ...dto,
      inspectorId: inspection.inspectorId,
      quantity: inspection.quantityRejected,
    });

    return {
      statusCode: STATUS_CODES.Created,
      data: ret,
    };
  }

  async findAll(page: number, limit: number, q?: FilterReturnsDto) {
    const rets = await this.returnsRepo.findAll(page, limit, q);

    return {
      statusCode: STATUS_CODES.OK,
      size: rets.length,
      data: rets,
    };
  }

  async findOne(id: string) {
    const rets = await this.checkExistingReturn(id);

    return {
      statusCode: STATUS_CODES.OK,
      data: rets,
    };
  }

  async accept(userId: string, id: string) {
    await this.transitionReturn(id, 'approved', { approvedById: userId });

    return {
      statusCode: STATUS_CODES.OK,
      message: `Return request approved successfully`,
    };
  }

  async reject(id: string) {
    const rets = await this.checkExistingReturn(id);
    if (rets.status === 'completed')
      throw new APIError(
        `Cannot transition return request from completed to rejected`,
        STATUS_CODES.BadRequest,
      );

    await this.returnsRepo.updateOne(id, {
      status: 'rejected',
    });

    return {
      statusCode: STATUS_CODES.OK,
      message: `Return request rejected successfully`,
    };
  }

  async complete(id: string) {
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
    data?: Partial<Return>,
  ) {
    const ret = await this.checkExistingReturn(id);
    const validNext = RETURN_REQS_VALID_TRANSITIONS[ret.status];

    if (validNext !== to)
      throw new APIError(
        `Cannot transition return request from "${ret.status}" to "${to}"`,
        STATUS_CODES.BadRequest,
      );

    await this.returnsRepo.updateOne(id, {
      status: to,
      ...data,
    });
  }

  private async checkExistingReturn(id: string) {
    const ret = await this.returnsRepo.findOne(id);
    if (!ret)
      throw new APIError(`No return found with this id`, STATUS_CODES.NotFound);

    return ret;
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
}
