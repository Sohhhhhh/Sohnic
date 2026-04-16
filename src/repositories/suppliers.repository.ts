import { db } from '../config/drizzle';
import { Supplier } from '../types/app.types';
import { suppliers } from '../../drizzle/schema';
import { ISuppliersRepository } from '../interfaces';
import { CreateSupplierDto } from '../dtos/suppliers/createSupplier.dto';
import { eq } from 'drizzle-orm';
import { UpdateSupplierDto } from '../dtos/suppliers/updateSupplier.dto';

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

  async findOne(id: string): Promise<Supplier | undefined> {
    const supplier = await db.query.suppliers.findFirst({
      where: eq(suppliers.id, id),
    });

    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await db
      .update(suppliers)
      .set({ ...dto })
      .where(eq(suppliers.id, id))
      .returning();

    return supplier[0];
  }

  async deactivate(id: string): Promise<Supplier> {
    const supplier = await db
      .update(suppliers)
      .set({ isActive: false })
      .where(eq(suppliers.id, id))
      .returning();

    return supplier[0];
  }

  async activate(id: string): Promise<Supplier> {
    const supplier = await db
      .update(suppliers)
      .set({ isActive: true })
      .where(eq(suppliers.id, id))
      .returning();

    return supplier[0];
  }
}
