import { validate } from '../middlewares/validate';
import { createSaleSchema } from '../dtos/sales/createSale.dto';
import { filterSalesQuerySchema } from '../dtos/sales/filterSales.dto';

// CREATE SALE
export const validateCreateSale = validate({ body: createSaleSchema });
export type createSaleValidatedCtrlr = typeof validateCreateSale;

// FILTER SALES
export const validateFilterSales = validate({
  query: filterSalesQuerySchema,
});
export type filterSalesValidatedCtrlr = typeof validateFilterSales;
