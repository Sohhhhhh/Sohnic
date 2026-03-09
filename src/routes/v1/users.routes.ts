import { Router } from 'express';
import { isAuthenticated } from '../../containers/middleware.container';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { usersController } from '../../containers/users.container';
import validate from '../../middlewares/validate';
import { idSchema } from '../../dtos/id.dto';

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

export const usersRoutes = router;
