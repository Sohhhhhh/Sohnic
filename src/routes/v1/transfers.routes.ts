import { Router } from 'express';

import {
  validateCreateTransferRequest,
  validateFilterTransferRequests,
  validateApproveTransferRequest,
  validateRejectTransferRequest,
  validateReceiveTransferRequest,
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

router.patch(
  '/:id/approve',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  validateApproveTransferRequest,
  transfersController.approve,
);

router.patch(
  '/:id/reject',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  validateRejectTransferRequest,
  transfersController.reject,
);

router.patch(
  '/:id/dispatch',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager'),
  validateId,
  transfersController.dispatch,
);

router.patch(
  '/:id/receive',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'storage_manager'),
  validateId,
  validateReceiveTransferRequest,
  transfersController.receive,
);

router.patch(
  '/:id/complete',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  transfersController.complete,
);

router.patch(
  '/:id/cancel',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  transfersController.cancel,
);

export const transfersRoutes = router;
