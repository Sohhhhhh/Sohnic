import { Router } from 'express';

import {
  validateCreatePurchaseRequest,
  validateFilterPurchaseRequests,
} from '../../validators/purchasing.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { purchasingController } from '../../containers/purchasing.container';

const router = Router();

router.post(
  '/requests',
  isAuthenticated,
  isAuthorized('accountant', 'storage_manager', 'super_admin'),
  validateCreatePurchaseRequest,
  purchasingController.createPurchaseRequest,
);

router.get(
  '/requests',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateFilterPurchaseRequests,
  purchasingController.getAllPurchaseRequests,
);

export const purchasingRoutes = router;
