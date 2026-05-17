import { db } from '../config/drizzle';
import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';
import { CreateItemDto } from '../dtos/items/createItem.dto';
import { itemResponseSchema } from '../dtos/items/itemResponse.dto';
import {
  IItemsRepository,
  IItemsService,
  IItemSuppliersRepository,
} from '../interfaces';

export class ItemsService implements IItemsService {
  constructor(
    private readonly itemsRepo: IItemsRepository,
    private readonly itemSuppliersRepo: IItemSuppliersRepository,
  ) {}

  async create(dto: CreateItemDto) {
    const item = await this.itemsRepo.create(dto);

    return {
      statusCode: STATUS_CODES.Created,
      data: itemResponseSchema.parse(item),
    };
  }

  async delete(id: string) {
    await db.transaction(async (tx) => {
      const item = await this.itemsRepo.findOne(id);
      if (!item)
        throw new APIError('No item found with this id', STATUS_CODES.NotFound);

      await this.itemSuppliersRepo.deleteByItemId(id, tx);
      await this.itemsRepo.delete(id, tx);
    });

    return {
      statusCode: STATUS_CODES.NoContent,
      message: 'Item deleted successfully',
    };
  }
}
