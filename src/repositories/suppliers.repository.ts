import { db } from '../config/drizzle';
import { Supplier } from '../types/app.types';
import { suppliers } from '../../drizzle/schema';
import { ISuppliersRepository } from '../interfaces';
import { CreateSupplierDto } from '../dtos/createSupplier.dto';
import { eq } from 'drizzle-orm';

export class SuppliersRepository implements ISuppliersRepository {
  async create(dto: CreateSupplierDto): Promise<Supplier> {
    const supplier = await db
      .insert(suppliers)
      .values({
        ...dto,
      })
      .returning();

    return supplier[0];
  }

  async getSupplierByEmail(email: string): Promise<Supplier | undefined> {
    const supplier = await db.query.suppliers.findFirst({
      where: eq(suppliers.email, email),
    });

    return supplier;
  }

  async findAll(): Promise<Supplier[]> {
    return db.query.suppliers.findMany();
  }
}
