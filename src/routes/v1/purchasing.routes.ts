import { Router } from 'express';

import {
  validateCreatePurchaseRequest,
  validateFilterPurchaseRequests,
} from '../../validators/purchasing.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { validateId } from '../../validators/common.validator';
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

router.get(
  '/requests/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  purchasingController.getPurchaseRequest,
);
export const purchasingRoutes = router;
