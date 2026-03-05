import { Router } from 'express';
import { isAuthenticated } from '../../containers/middleware.container';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { usersController } from '../../containers/users.container';

const router = Router();
router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'hr'),
  usersController.findAll,
);

export const usersRoutes = router;
