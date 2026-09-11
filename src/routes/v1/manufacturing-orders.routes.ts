import { Router } from 'express';

import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { manufacturingOrdersController } from '../../containers/manufacturing-orders.container';
import { validateCreateManufacturingOrder } from '../../validators/manufacturing-orders.validator';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('accountant', 'super_admin'),
  validateCreateManufacturingOrder,
  manufacturingOrdersController.create,
);

export const manufacturingOrdersRoutes = router;
