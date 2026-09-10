import { and, eq, ilike, SQL } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { manufacturers } from '../../drizzle/schema';
import { IManufacturersRepository } from '../interfaces';
import { CreateManufacturerDto } from '../dtos/manufacturers/createManufacturer.dto';
import { FilterManufacturersDto } from '../dtos/manufacturers/filterManufacturers.dto';
import { UpdateManufacturerDto } from '../dtos/manufacturers/updateManufacturer.dto';

export class ManufacturersRepository implements IManufacturersRepository {
  async create(dto: CreateManufacturerDto) {
    const manufacturer = await db
      .insert(manufacturers)
      .values({
        ...dto,
      })
      .returning();

    return manufacturer[0];
  }

  async findOneByEmail(email: string) {
    const manufacturer = await db.query.manufacturers.findFirst({
      where: eq(manufacturers.email, email),
    });

    return manufacturer;
  }

  async findAll(page: number, limit: number, q?: FilterManufacturersDto) {
    const offset = (page - 1) * limit;

    const conditions = [
      q?.country ? ilike(manufacturers.country, q.country) : undefined,
      q?.isActive !== undefined
        ? eq(manufacturers.isActive, q.isActive)
        : undefined,
    ].filter(Boolean) as SQL[];

    return db.query.manufacturers.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      limit,
      offset,
      orderBy: (manufacturers, { desc }) => [desc(manufacturers.createdAt)],
    });
  }

  async findOne(id: string) {
    return db.query.manufacturers.findFirst({
      where: eq(manufacturers.id, id),
    });
  }

  async update(id: string, dto: UpdateManufacturerDto) {
    const updated = await db
      .update(manufacturers)
      .set({ ...dto })
      .where(eq(manufacturers.id, id))
      .returning();

    return updated[0];
  }
}
