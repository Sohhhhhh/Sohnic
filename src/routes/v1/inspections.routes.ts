import { Router } from 'express';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { validateId } from '../../validators/common.validator';
import { isAuthenticated } from '../../containers/middleware.container';
import { inspectionsController } from '../../containers/inspections.container';
import { validateCreateInspection } from '../../validators/inspections.validator';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('inspector', 'super_admin'),
  validateCreateInspection,
  inspectionsController.create,
);

router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'inspector'),
  validateId,
  inspectionsController.getOne,
);

export const inspectionsRoutes = router;
