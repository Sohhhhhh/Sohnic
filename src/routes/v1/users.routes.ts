import { Router } from 'express';

import {
  validateBranchId,
  validateId,
} from '../../validators/common.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { validateRoleId } from '../../validators/users.validator';
import { usersController } from '../../containers/users.container';
import { isAuthenticated } from '../../containers/middleware.container';

const router = Router();
router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'hr'),
  usersController.findAll,
);
router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'hr'),
  validateId,
  usersController.findOne,
);
router.patch(
  '/:id/branch',
  isAuthenticated,
  isAuthorized('super_admin', 'hr'),
  validateId,
  validateBranchId,
  usersController.updateBranch,
);
router.patch(
  '/:id/role',
  isAuthenticated,
  isAuthorized('super_admin'),
  validateId,
  validateRoleId,
  usersController.updateRole,
);
router.patch(
  '/:id/activate',
  isAuthenticated,
  isAuthorized('super_admin', 'hr'),
  validateId,
  usersController.activate,
);
router.patch(
  '/:id/deactivate',
  isAuthenticated,
  isAuthorized('super_admin', 'hr'),
  validateId,
  usersController.deactivate,
);

export const usersRoutes = router;
