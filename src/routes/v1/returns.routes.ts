import { Router } from 'express';

import {
  validateCreateSupplierReturn,
  validateFilterSupplierReturns,
} from '../../validators/returns.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { returnsController } from '../../containers/returns.container';
import { isAuthenticated } from '../../containers/middleware.container';
import { validateId } from '../../validators/common.validator';

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

router.get(
  '/supplier/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateId,
  returnsController.getOneSupplierReturn,
);

router.patch(
  '/supplier/:id/accept',
  isAuthenticated,
  isAuthorized('super_admin'),
  validateId,
  returnsController.acceptSupplieReturn,
);

router.patch(
  '/supplier/:id/reject',
  isAuthenticated,
  isAuthorized('super_admin'),
  validateId,
  returnsController.rejectSupplierReturn,
);

router.patch(
  '/supplier/:id/complete',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateId,
  returnsController.completeSupplierReturn,
);

export const returnsRoutes = router;
