import { db } from '../config/drizzle';
import { manufacturingOrders } from '../../drizzle/schema';
import { IManufacturingOrdersRepository } from '../interfaces';
import { CreateManufacturingOrderData } from '../dtos/manufacturing-orders/createManufacturingOrder.dto';

export class ManufacturingOrdersRepository
  implements IManufacturingOrdersRepository
{
  async create(data: CreateManufacturingOrderData) {
    const order = await db
      .insert(manufacturingOrders)
      .values({ ...data })
      .returning();

    return order[0];
  }
}
