import { Router } from 'express';
import { isAuthenticated } from '../../containers/middleware.container';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { usersController } from '../../containers/users.container';
import validate from '../../middlewares/validate';
import { idSchema } from '../../dtos/id.dto';
import { branchIdSchema } from '../../dtos/branchId.dto';

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
  validate(idSchema),
  usersController.findOne,
);
router.patch(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'hr'),
  validate(idSchema.merge(branchIdSchema)),
  usersController.updateBranch,
);
router.patch(
  '/:id/activate',
  isAuthenticated,
  isAuthorized('super_admin', 'hr'),
  validate(idSchema),
  usersController.activate,
);
router.patch(
  '/:id/deactivate',
  isAuthenticated,
  isAuthorized('super_admin', 'hr'),
  validate(idSchema),
  usersController.deactivate,
);

export const usersRoutes = router;
