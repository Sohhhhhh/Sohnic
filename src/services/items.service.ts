import {
  IItemsRepository,
  IItemsService,
  IItemSuppliersRepository,
  IBomRepository,
} from '../interfaces';
import {
  AddBomComponentDto,
  UpdateBomComponentDto,
} from '../dtos/items/bom.dto';
import { db } from '../config/drizzle';
import APIError from '../utils/APIError';
import { STATUS_CODES } from '../utils/statusCodes';
import { CreateItemDto } from '../dtos/items/createItem.dto';
import { UpdateItemDto } from '../dtos/items/updateItem.dto';
import { FilterItemsDto } from '../dtos/items/filterItems.dto';
import { itemResponseSchema } from '../dtos/items/itemResponse.dto';

export class ItemsService implements IItemsService {
  constructor(
    private readonly itemsRepo: IItemsRepository,
    private readonly itemSuppliersRepo: IItemSuppliersRepository,
    private readonly bomRepo: IBomRepository,
  ) {}

  async create(dto: CreateItemDto) {
    const item = await this.itemsRepo.create(dto);

    return {
      statusCode: STATUS_CODES.Created,
      data: itemResponseSchema.parse(item),
    };
  }

  async findAll(page: number, limit: number, q?: FilterItemsDto) {
    const items = await this.itemsRepo.findAll(page, limit, q);

    return {
      statusCode: STATUS_CODES.OK,
      size: items.length,
      data: items.map((item) => itemResponseSchema.parse(item)),
    };
  }

  async findOne(id: string) {
    const item = await this.checkExistingItem(id);

    return {
      statusCode: STATUS_CODES.OK,
      data: itemResponseSchema.parse(item),
    };
  }

  async update(id: string, dto: UpdateItemDto) {
    const item = await this.checkExistingItem(id);
    this.checkDto(item.type, dto);

    const updatedItem = await this.itemsRepo.update(id, dto);

    return {
      statusCode: STATUS_CODES.OK,
      data: itemResponseSchema.parse(updatedItem),
    };
  }

  async delete(id: string) {
    await db.transaction(async (tx) => {
      await this.checkExistingItem(id);

      await this.itemSuppliersRepo.deleteByItemId(id, tx);
      await this.bomRepo.deleteByItemOrComponentId(id, tx);
      await this.itemsRepo.delete(id, tx);
    });

    return {
      statusCode: STATUS_CODES.NoContent,
      message: 'Item deleted successfully',
    };
  }
  // ---- BOM ----

  async addBomComponent(itemId: string, dto: AddBomComponentDto) {
    const [mainItem] = await Promise.all([
      this.checkExistingItem(itemId, 'main'),
      this.checkExistingItem(dto.componentId, 'component'),
    ]);

    if (mainItem.sellableType !== 'finished')
      throw new APIError(
        'Only finished sellable items can have a BOM',
        STATUS_CODES.BadRequest,
      );

    if (itemId === dto.componentId)
      throw new APIError(
        'An item cannot be a component of itself',
        STATUS_CODES.BadRequest,
      );

    const exists = await this.bomRepo.checkIfExists(itemId, dto.componentId);
    if (exists)
      throw new APIError(
        'This component is already in the BOM',
        STATUS_CODES.Conflict,
      );

    await this.bomRepo.addComponent(itemId, dto);

    return {
      statusCode: STATUS_CODES.Created,
      message: 'Component added to BOM successfully',
    };
  }

  async getBom(itemId: string) {
    await this.checkExistingItem(itemId);
    const bom = await this.bomRepo.getBomByItemId(itemId);

    return {
      statusCode: STATUS_CODES.OK,
      size: bom.length,
      data: bom,
    };
  }

  async updateBomComponent(
    itemId: string,
    componentId: string,
    dto: UpdateBomComponentDto,
  ) {
    const exists = await this.bomRepo.checkIfExists(itemId, componentId);
    if (!exists)
      throw new APIError(
        'Component not found in this BOM',
        STATUS_CODES.NotFound,
      );

    await this.bomRepo.updateComponent(itemId, componentId, dto);

    return {
      statusCode: STATUS_CODES.OK,
      message: 'BOM component updated successfully',
    };
  }

  async removeBomComponent(itemId: string, componentId: string) {
    const exists = await this.bomRepo.checkIfExists(itemId, componentId);
    if (!exists)
      throw new APIError(
        'Component not found in this BOM',
        STATUS_CODES.NotFound,
      );

    await this.bomRepo.removeComponent(itemId, componentId);

    return {
      statusCode: STATUS_CODES.NoContent,
      message: 'BOM component removed successfully',
    };
  }

  // ---- Helpers ----

  async checkExistingItem(id: string, type: string = '') {
    const item = await this.itemsRepo.findOne(id);
    if (!item)
      throw new APIError(
        `No ${type + ' '}item found with this id`,
        STATUS_CODES.NotFound,
      );

    return item;
  }

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
