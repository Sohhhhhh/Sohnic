import { Router } from 'express';

import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { validateCreateSupplierReturn } from '../../validators/returns.validator';
import { returnsController } from '../../containers/returns.container';

const router = Router();

router.post(
  '/supplier',
  isAuthenticated,
  isAuthorized('accountant', 'super_admin'),
  validateCreateSupplierReturn,
  returnsController.createSupplierReturn,
);

export const returnsRoutes = router;
