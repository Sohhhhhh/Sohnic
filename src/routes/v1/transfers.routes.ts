import { Router } from 'express';

import {
  validateCreateTransferRequest,
  validateFilterTransferRequests,
} from '../../validators/transfers.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { validateId } from '../../validators/common.validator';
import { isAuthenticated } from '../../containers/middleware.container';
import { transfersController } from '../../containers/transfers.container';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('branch_admin', 'storage_manager', 'super_admin'),
  validateCreateTransferRequest,
  transfersController.create,
);

router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'storage_manager'),
  validateFilterTransferRequests,
  transfersController.findAll,
);

router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'storage_manager'),
  validateId,
  transfersController.findOne,
);

export const transfersRoutes = router;
