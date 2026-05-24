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

    const result = await client
      .insert(supplierQuotations)
      .values(dto)
      .returning();

    return result[0];
  }

  async createManyItems(dto: CreateSupplierQuotationItemData[], tx?: TX) {
    const client = tx || db;
    await client.insert(quotationItems).values(dto);
  }
}
