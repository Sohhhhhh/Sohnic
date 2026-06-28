import { Router } from 'express';

import {
  validateCreateSupplierReturn,
  validateFilterSupplierReturns,
} from '../../validators/returns.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { returnsController } from '../../containers/returns.container';
import { isAuthenticated } from '../../containers/middleware.container';

const router = Router();

router.post(
  '/supplier',
  isAuthenticated,
  isAuthorized('accountant', 'super_admin'),
  validateCreateSupplierReturn,
  returnsController.createSupplierReturn,
);

router.get(
  '/supplier',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateFilterSupplierReturns,
  returnsController.getAllSupplierReturns,
);

export const returnsRoutes = router;
