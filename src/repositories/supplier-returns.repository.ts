import { and, eq, SQL } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { SupplierReturn } from '../types/app.types';
import { supplierReturns } from '../../drizzle/schema';
import { ISupplierReturnsRepository } from '../interfaces/repositories';
import { CreateSupplierReturnData } from '../dtos/returns/supplier-returns/createSupplierReturn.dto';
import { FilterSupplierReturnsDto } from '../dtos/returns/supplier-returns/filterSupplierReturns.dto';

export class SupplierReturnsRepository implements ISupplierReturnsRepository {
  async createSupplierReturn(
    dto: CreateSupplierReturnData,
  ): Promise<SupplierReturn> {
    const supplierReturn = await db
      .insert(supplierReturns)
      .values(dto)
      .returning();

    return supplierReturn[0];
  }

  async getAllSupplierReturns(
    page: number,
    limit: number,
    q?: FilterSupplierReturnsDto,
  ) {
    const offset = (page - 1) * limit;

    const conditions = [
      q?.itemId ? eq(supplierReturns.itemId, q.itemId) : undefined,
      q?.supplierId ? eq(supplierReturns.supplierId, q.supplierId) : undefined,
      q?.purchaseOrderId
        ? eq(supplierReturns.purchaseOrderId, q.purchaseOrderId)
        : undefined,
    ].filter(Boolean) as SQL[];

    return db.query.supplierReturns.findMany({
      where: conditions.length ? and(...conditions) : undefined,

      limit,
      offset,
      orderBy: (supplierReturns, { desc }) => [
        desc(supplierReturns.submissionDate),
      ],
    });
  }

  async getOneSupplierReturn(id: string) {
    const supplierReturn = await db.query.supplierReturns.findFirst({
      where: eq(supplierReturns.id, id),
    });

    return supplierReturn;
  }

  async updateSupplierReturn(id: string, data: Partial<SupplierReturn>) {
    const result = await db
      .update(supplierReturns)
      .set(data)
      .where(eq(supplierReturns.id, id))
      .returning();

    return result[0];
  }
}
