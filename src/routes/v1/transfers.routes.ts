import { Router } from 'express';

import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { transfersController } from '../../containers/transfers.container';
import { validateCreateTransferRequest } from '../../validators/transfers.validator';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('branch_admin', 'storage_manager', 'super_admin'),
  validateCreateTransferRequest,
  transfersController.create,
);

export const transfersRoutes = router;
