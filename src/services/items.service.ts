import { db } from '../config/drizzle';
import APIError from '../utils/APIError';
import STATUS_CODES from '../utils/statusCodes';
import { CreateItemDto } from '../dtos/items/createItem.dto';
import { UpdateItemDto } from '../dtos/items/updateItem.dto';
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

  async update(id: string, dto: UpdateItemDto) {
    const item = await this.itemsRepo.findOne(id);
    if (!item)
      throw new APIError('No item found with this id', STATUS_CODES.NotFound);

    this.checkDto(item.type, dto);

    const updatedItem = await this.itemsRepo.update(id, dto);

    return {
      statusCode: STATUS_CODES.OK,
      data: itemResponseSchema.parse(updatedItem),
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

  // ---- Helpers ----

  private checkDto(type: string, dto: UpdateItemDto) {
    const RAW_MATERIAL_FIELDS = ['unitOfMeasurement', 'standardPrice'];
    const SELLABLE_ITEM_FIELDS = [
      'categoryId',
      'salePrice',
      'manufacturingCost',
      'purchasePrice',
      'description',
    ];

    if (type === 'raw_material') {
      const invalid = SELLABLE_ITEM_FIELDS.filter((f) => f in dto);
      if (invalid.length)
        throw new APIError(
          `These fields do not apply to a raw material: ${invalid.join(', ')}`,
          STATUS_CODES.BadRequest,
        );
    }

    if (type === 'sellable_item') {
      const invalid = RAW_MATERIAL_FIELDS.filter((f) => f in dto);
      if (invalid.length)
        throw new APIError(
          `These fields do not apply to a sellable item: ${invalid.join(', ')}`,
          STATUS_CODES.BadRequest,
        );
    }
  }
}
