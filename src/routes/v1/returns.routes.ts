import { Router } from 'express';

import { isAuthorized } from '../../middlewares/isAuthorized';
import { validateId } from '../../validators/common.validator';
import { returnsController } from '../../containers/returns.container';
import { isAuthenticated } from '../../containers/middleware.container';
import {
  validateCreateReturn,
  validateFilterReturns,
} from '../../validators/returns.validator';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('accountant', 'super_admin'),
  validateCreateReturn,
  returnsController.create,
);

router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateFilterReturns,
  returnsController.findAll,
);

router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateId,
  returnsController.findOne,
);

router.patch(
  '/:id/accept',
  isAuthenticated,
  isAuthorized('super_admin'),
  validateId,
  returnsController.accept,
);

router.patch(
  '/:id/reject',
  isAuthenticated,
  isAuthorized('super_admin'),
  validateId,
  returnsController.reject,
);

router.patch(
  '/:id/complete',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateId,
  returnsController.complete,
);

export const returnsRoutes = router;
