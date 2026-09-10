import { Router } from 'express';

import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { manufacturersController } from '../../containers/manufacturers.container';
import {
  validateCreateManufacturer,
  validateManufacturersQuery,
  validateUpdateManufacturer,
} from '../../validators/manufacturers.validator';
import { validateId } from '../../validators/common.validator';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateCreateManufacturer,
  manufacturersController.create,
);

router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'accountant', 'storage_manager'),
  validateManufacturersQuery,
  manufacturersController.findAll,
);

router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'accountant', 'storage_manager'),
  validateId,
  manufacturersController.findOne,
);

router.patch(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  validateUpdateManufacturer,
  manufacturersController.update,
);

export const manufacturersRoutes = router;
