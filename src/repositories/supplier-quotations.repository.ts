import { eq } from 'drizzle-orm';

import { db } from '../config/drizzle';
import { ISupplierQuotationsRepository, TX } from '../interfaces';
import {
  CreateSupplierQuotationData,
  CreateSupplierQuotationItemData,
} from '../dtos/purchasing/createSupplierQuotation.dto';
import { quotationItems, supplierQuotations } from '../../drizzle/schema';

export class SupplierQuotationsRepository implements ISupplierQuotationsRepository {
  async createQuotation(dto: CreateSupplierQuotationData, tx?: TX) {
    const client = tx || db;

    const quot = await client
      .insert(supplierQuotations)
      .values(dto)
      .returning();

    return quot[0];
  }

  async createManyItems(dto: CreateSupplierQuotationItemData[], tx?: TX) {
    const client = tx || db;
    await client.insert(quotationItems).values(dto);
  }

  async getPurchReqQuotations(id: string, page: number, limit: number) {
    const offset = (page - 1) * limit;

    const quots = await db.query.supplierQuotations.findMany({
      where: eq(supplierQuotations.purchaseRequestId, id),
      with: {
        items: {
          columns: {
            id: false,
            quotationId: false,
          },
        },
      },
      limit,
      offset,
    });

    return quots;
  }

  async getQuotation(id: string) {
    const quot = await db.query.supplierQuotations.findFirst({
      where: eq(supplierQuotations.id, id),
      with: {
        purchaseRequest: {
          columns: { branchId: true },
        },

        items: {
          columns: {
            id: false,
            quotationId: false,
          },
        },
      },
    });

    return quot;
  }
}
