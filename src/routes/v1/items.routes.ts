import { Router } from 'express';

import { isAuthorized } from '../../middlewares/isAuthorized';
import { validateId } from '../../validators/common.validator';
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

router.delete(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager'),
  validateId,
  itemsController.delete,
);

export const itemsRoutes = router;
