import { Router } from 'express';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { purchasingController } from '../../containers/purchasing.container';
import { validateCreatePurchaseRequest } from '../../validators/purchasing.validator';

const router = Router();

router.post(
  '/requests',
  isAuthenticated,
  isAuthorized('accountant', 'storage_manager', 'super_admin'),
  validateCreatePurchaseRequest,
  purchasingController.createPurchaseRequest,
);

export const purchasingRoutes = router;
