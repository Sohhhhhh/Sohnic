import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { customers } from '../../drizzle/schema';
import { ICustomersRepository, TX } from '../interfaces';
import { CreateCustomerData } from '../dtos/sales/createSale.dto';

export class CustomersRepository implements ICustomersRepository {
  async findById(id: string) {
    return db.query.customers.findFirst({
      where: eq(customers.id, id),
    });
  }

  async create(data: CreateCustomerData, tx?: TX) {
    const client = tx || db;
    const [customer] = await client.insert(customers).values(data).returning();
    return customer;
  }
}
