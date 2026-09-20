import { Router } from 'express';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { salesController } from '../../containers/sales.container';
import { validateCreateSale } from '../../validators/sales.validator';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('cashier', 'branch_admin', 'super_admin'),
  validateCreateSale,
  salesController.create,
);

export const salesRoutes = router;
