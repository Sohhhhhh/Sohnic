import { CreateItemDto } from '../dtos/items/createItem.dto';
import { itemResponseSchema } from '../dtos/items/itemResponse.dto';
import { IItemsRepository, IItemsService } from '../interfaces';
import STATUS_CODES from '../utils/statusCodes';

export class ItemsService implements IItemsService {
  constructor(private readonly itemsRepo: IItemsRepository) {}

  async create(dto: CreateItemDto) {
    const item = await this.itemsRepo.create(dto);

    return {
      statusCode: STATUS_CODES.Created,
      data: itemResponseSchema.parse(item),
    };
  }
}
