import { Router } from 'express';
import validate from '../../middlewares/validate';
import { loginSchema } from '../../dtos/login.dto';
import { createUserSchema } from '../../dtos/createUser.dto';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { setPasswordSchema } from '../../dtos/setPassword.dto';
import {
  authController,
  isAuthenticated,
} from '../../containers/auth.container';
import { forgetPasswordSchema } from '../../dtos/forgetPassword.dto';
import { changePasswordSchema } from '../../dtos/changePassword.dto';

const router = Router();

router.post(
  '/create-user',
  isAuthenticated,
  isAuthorized('super_admin', 'hr'),
  validate(createUserSchema),
  authController.createUser,
);
router.post(
  '/set-password/:encodedToken',
  validate(setPasswordSchema),
  authController.setPassword,
);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', isAuthenticated, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post(
  '/forget-password',
  validate(forgetPasswordSchema),
  authController.forgetPassword,
);
router.post(
  '/change-password',
  isAuthenticated,
  validate(changePasswordSchema),
  authController.changePassword,
);

export const authRoutes = router;
