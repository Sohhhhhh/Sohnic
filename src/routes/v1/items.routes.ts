import { Router } from 'express';

import { isAuthorized } from '../../middlewares/isAuthorized';
import { itemsController } from '../../containers/items.container';
import { validateCreateItem } from '../../validators/items.validator';
import { isAuthenticated } from '../../containers/middleware.container';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager', 'accountant'),
  validateCreateItem,
  itemsController.create,
);

export const itemsRoutes = router;
