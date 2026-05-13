import { Router } from 'express';

import {
  validateCreateCategory,
  validateUpdateCategory,
} from '../../validators/categories.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { validateId } from '../../validators/common.validator';
import { isAuthenticated } from '../../containers/middleware.container';
import { categoriesController } from '../../containers/categories.container';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager'),
  validateCreateCategory,
  categoriesController.create,
);

router.patch(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager'),
  validateId,
  validateUpdateCategory,
  categoriesController.update,
);

router.delete(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager'),
  validateId,
  categoriesController.delete,
);

export const categoriesRoutes = router;
