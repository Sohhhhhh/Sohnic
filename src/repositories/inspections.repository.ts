import { eq, and, SQL } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { Inspection } from '../types/app.types';
import { inspections } from '../../drizzle/schema';
import { IInspectionsRepository } from '../interfaces';
import { CreateInspectionDto } from '../dtos/inspections/createInspection.dto';
import { FilterInspectionsDto } from '../dtos/inspections/filterInspections.dto';

export class InspectionsRepository implements IInspectionsRepository {
  async create(
    branchId: string,
    inspectorId: string,
    dto: CreateInspectionDto,
  ): Promise<Inspection> {
    const inspection = await db
      .insert(inspections)
      .values({ ...dto, inspectorId, branchId })
      .returning();

    return inspection[0];
  }

  async getOne(id: string): Promise<Inspection | undefined> {
    const inspection = await db.query.inspections.findFirst({
      where: eq(inspections.id, id),
    });

    return inspection;
  }

  async getAll(page: number, limit: number, q?: FilterInspectionsDto) {
    const offset = (page - 1) * limit;

    const conditions = [
      q?.type ? eq(inspections.type, q.type) : undefined,
      q?.inspectionResult
        ? eq(inspections.inspectionResult, q.inspectionResult)
        : undefined,
      q?.itemId ? eq(inspections.itemId, q.itemId) : undefined,
      q?.inspectorId ? eq(inspections.inspectorId, q.inspectorId) : undefined,
      q?.branchId ? eq(inspections.branchId, q.branchId) : undefined,
    ].filter(Boolean) as SQL[];

    return db.query.inspections.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      limit,
      offset,
      orderBy: (inspections, { desc }) => [desc(inspections.createdAt)],
    });
  }
}
