import { Router } from 'express';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { salesController } from '../../containers/sales.container';
import {
  validateCreateSale,
  validateFilterSales,
} from '../../validators/sales.validator';
import { validateId } from '../../validators/common.validator';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('cashier', 'branch_admin', 'super_admin'),
  validateCreateSale,
  salesController.create,
);

router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'accountant'),
  validateFilterSales,
  salesController.findAll,
);

router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'accountant'),
  validateId,
  salesController.findOne,
);

export const salesRoutes = router;
