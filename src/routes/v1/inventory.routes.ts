import { Router } from 'express';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { inventoryController } from '../../containers/inventory.container';
import {
  validateId,
  validatePagination,
} from '../../validators/common.validator';
import {
  validateFilterInventory,
  validateAdjustStock,
} from '../../validators/inventory.validator';

const router = Router();

router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'storage_manager', 'accountant'),
  validateFilterInventory,
  validatePagination,
  inventoryController.findAll,
);

router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'storage_manager', 'accountant'),
  validateId,
  inventoryController.findOne,
);

router.patch(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager'),
  validateId,
  validateAdjustStock,
  inventoryController.adjust,
);

export const inventoryRoutes = router;
