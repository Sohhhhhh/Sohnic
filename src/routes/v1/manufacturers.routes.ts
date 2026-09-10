import { Router } from 'express';

import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { manufacturersController } from '../../containers/manufacturers.container';
import { validateCreateManufacturer } from '../../validators/manufacturers.validator';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateCreateManufacturer,
  manufacturersController.create,
);

export const manufacturersRoutes = router;
