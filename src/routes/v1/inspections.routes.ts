import { Router } from 'express';

import {
  validateCreateInspection,
  validateFilterInspections,
} from '../../validators/inspections.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { validateId } from '../../validators/common.validator';
import { isAuthenticated } from '../../containers/middleware.container';
import { inspectionsController } from '../../containers/inspections.container';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('inspector', 'super_admin'),
  validateCreateInspection,
  inspectionsController.create,
);

router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateFilterInspections,
  inspectionsController.getAll,
);

router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'inspector'),
  validateId,
  inspectionsController.getOne,
);

export const inspectionsRoutes = router;
