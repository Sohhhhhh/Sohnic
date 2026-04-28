import { RequestHandler, Router } from 'express';

import {
  validateChangePass,
  validateCreateUser,
  validateForgetPass,
  validateLogin,
  validateSetPassword,
} from '../../validators/users.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { authController } from '../../containers/auth.container';
import { isAuthenticated } from '../../containers/middleware.container';

const router = Router();

router.post(
  '/create-user',
  isAuthenticated,
  isAuthorized('super_admin', 'hr'),
  validateCreateUser,
  authController.createUser,
);
router.post(
  '/set-password/:encodedToken',
  validateSetPassword as unknown as RequestHandler,
  authController.setPassword as unknown as RequestHandler,
);
router.post(
  '/login',
  validateLogin as unknown as RequestHandler,
  authController.login as unknown as RequestHandler,
);
router.post('/logout', isAuthenticated, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post(
  '/forget-password',
  validateForgetPass as unknown as RequestHandler,
  authController.forgetPassword as unknown as RequestHandler,
);
router.post(
  '/change-password',
  isAuthenticated,
  validateChangePass,
  authController.changePassword,
);

export const authRoutes = router;
