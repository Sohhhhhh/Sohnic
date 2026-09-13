import { Router } from 'express';

import {
  validateCreateManufacturingOrder,
  validateFilterManufacturingOrders,
} from '../../validators/manufacturing-orders.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { validateId } from '../../validators/common.validator';
import { isAuthenticated } from '../../containers/middleware.container';
import { manufacturingOrdersController } from '../../containers/manufacturing-orders.container';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('accountant', 'super_admin'),
  validateCreateManufacturingOrder,
  manufacturingOrdersController.create,
);

router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'accountant', 'storage_manager'),
  validateFilterManufacturingOrders,
  manufacturingOrdersController.findAll,
);

router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'accountant', 'storage_manager'),
  validateId,
  manufacturingOrdersController.findOne,
);

export const manufacturingOrdersRoutes = router;
