import { Router } from 'express';

import {
  validateCreateItem,
  validateUpdateItem,
  validateFilterItems,
  validateAddBomComponent,
  validateUpdateBomComponent,
} from '../../validators/items.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import {
  validateId,
  validateIdAndItemId,
} from '../../validators/common.validator';
import { itemsController } from '../../containers/items.container';
import { isAuthenticated } from '../../containers/middleware.container';
import { checkImmutableItemFields } from '../../middlewares/checkImmutableItemFields';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager', 'accountant'),
  validateCreateItem,
  itemsController.create,
);

router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager', 'accountant', 'branch_admin'),
  validateFilterItems,
  itemsController.findAll,
);

router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager', 'accountant', 'branch_admin'),
  validateId,
  itemsController.findOne,
);

router.patch(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager', 'accountant'),
  validateId,
  checkImmutableItemFields,
  validateUpdateItem,
  itemsController.update,
);

router.delete(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager'),
  validateId,
  itemsController.delete,
);

// ---- BOM ----

router.post(
  '/:id/bom',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager', 'accountant'),
  validateId,
  validateAddBomComponent,
  itemsController.addBomComponent,
);

router.get(
  '/:id/bom',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager', 'accountant', 'branch_admin'),
  validateId,
  itemsController.getBom,
);

router.patch(
  '/:id/bom/:itemId',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager', 'accountant'),
  validateIdAndItemId,
  validateUpdateBomComponent,
  itemsController.updateBomComponent,
);

router.delete(
  '/:id/bom/:itemId',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager', 'accountant'),
  validateIdAndItemId,
  itemsController.removeBomComponent,
);

export const itemsRoutes = router;
