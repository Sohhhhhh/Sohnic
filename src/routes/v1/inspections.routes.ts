import { Router } from 'express';
import { isAuthenticated } from '../../containers/middleware.container';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { validateCreateInspection } from '../../validators/inspections.validator';
import { inspectionsController } from '../../containers/inspections.container';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('inspector', 'super_admin'),
  validateCreateInspection,
  inspectionsController.create,
);

export const inspectionsRoutes = router;
