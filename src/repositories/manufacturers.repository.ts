import { eq } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { manufacturers } from '../../drizzle/schema';
import { IManufacturersRepository } from '../interfaces';
import { CreateManufacturerDto } from '../dtos/manufacturers/createManufacturer.dto';

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
}
