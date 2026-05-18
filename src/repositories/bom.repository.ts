import { eq, and, or } from 'drizzle-orm';

import {
  AddBomComponentDto,
  UpdateBomComponentDto,
} from '../dtos/items/bom.dto';
import { db } from '../config/drizzle';
import { IBomRepository, TX } from '../interfaces';
import { billOfMaterials, items } from '../../drizzle/schema';

import { BomLine } from '../types/app.types';

export class BomRepository implements IBomRepository {
  async addComponent(itemId: string, dto: AddBomComponentDto): Promise<void> {
    await db.insert(billOfMaterials).values({
      itemId,
      ...dto,
    });
  }

  async getBomByItemId(itemId: string): Promise<BomLine[]> {
    const bom = await db
      .select({
        componentId: billOfMaterials.componentId,
        quantityPerUnit: billOfMaterials.quantityPerUnit,
        name: items.name,
        sku: items.sku,
        type: items.type,
        sellableType: items.sellableType,
        unitOfMeasurement: items.unitOfMeasurement,
      })
      .from(billOfMaterials)
      .innerJoin(items, eq(billOfMaterials.componentId, items.id))
      .where(eq(billOfMaterials.itemId, itemId));

    return bom;
  }

  async checkIfExists(itemId: string, componentId: string): Promise<boolean> {
    const component = await db.query.billOfMaterials.findFirst({
      where: and(
        eq(billOfMaterials.itemId, itemId),
        eq(billOfMaterials.componentId, componentId),
      ),
    });

    return !!component;
  }

  async updateComponent(
    itemId: string,
    componentId: string,
    dto: UpdateBomComponentDto,
  ): Promise<void> {
    await db
      .update(billOfMaterials)
      .set(dto)
      .where(
        and(
          eq(billOfMaterials.itemId, itemId),
          eq(billOfMaterials.componentId, componentId),
        ),
      );
  }

  async removeComponent(itemId: string, componentId: string): Promise<void> {
    await db
      .delete(billOfMaterials)
      .where(
        and(
          eq(billOfMaterials.itemId, itemId),
          eq(billOfMaterials.componentId, componentId),
        ),
      );
  }

  async deleteByItemOrComponentId(id: string, tx?: TX): Promise<void> {
    const client = tx || db;

    await client
      .delete(billOfMaterials)
      .where(
        or(
          eq(billOfMaterials.itemId, id),
          eq(billOfMaterials.componentId, id),
        ),
      );
  }
}
