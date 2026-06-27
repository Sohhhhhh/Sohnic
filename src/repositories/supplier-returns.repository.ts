import { db } from '../config/drizzle';
import { SupplierReturn } from '../types/app.types';
import { supplierReturns } from '../../drizzle/schema';
import { ISupplierReturnsRepository } from '../interfaces/repositories';
import { CreateSupplierReturnData } from '../dtos/returns/supplier-returns/createSupplierReturn.dto';

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
}
