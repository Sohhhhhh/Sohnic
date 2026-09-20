import { validate } from '../middlewares/validate';
import { createSaleSchema } from '../dtos/sales/createSale.dto';

// CREATE SALE
export const validateCreateSale = validate({ body: createSaleSchema });
export type createSaleValidatedCtrlr = typeof validateCreateSale;
