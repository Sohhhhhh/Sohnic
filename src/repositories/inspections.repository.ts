import { eq } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { Inspection } from '../types/app.types';
import { inspections } from '../../drizzle/schema';
import { IInspectionsRepository } from '../interfaces';
import { CreateInspectionDto } from '../dtos/inspections/createInspection.dto';

export class InspectionsRepository implements IInspectionsRepository {
  async create(
    inspectorId: string,
    dto: CreateInspectionDto,
  ): Promise<Inspection> {
    const inspection = await db
      .insert(inspections)
      .values({ ...dto, inspectorId })
      .returning();

    return inspection[0];
  }

  async getOne(id: string): Promise<Inspection | undefined> {
    const inspection = await db.query.inspections.findFirst({
      where: eq(inspections.id, id),
    });

    return inspection;
  }
}
