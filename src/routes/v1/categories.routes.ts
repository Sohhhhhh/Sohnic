import { Router } from 'express';

import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { validateCreateCategory } from '../../validators/categories.validator';
import { categoriesController } from '../../containers/categories.container';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager'),
  validateCreateCategory,
  categoriesController.create,
);

export const categoriesRoutes = router;
