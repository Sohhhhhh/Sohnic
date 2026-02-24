import { Router } from 'express';
import {
  createUser,
  setPassword,
  forgetPassword,
  changePassword,
  login,
  logout,
  refreshToken,
} from '../../controllers/auth.controller';
import validate from '../../middlewares/validate';
import { loginSchema } from '../../dtos/login.dto';
import { createUserSchema } from '../../dtos/createUser.dto';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { setPasswordSchema } from '../../dtos/setPassword.dto';
import isAuthenticated from '../../middlewares/isAuthenticated';
import { forgetPasswordSchema } from '../../dtos/forgetPassword.dto';
import { changePasswordSchema } from '../../dtos/changePassword.dto';

const router = Router();

router.post(
  '/create-user',
  isAuthenticated,
  isAuthorized('super_admin', 'hr'),
  validate(createUserSchema),
  createUser,
);
router.post(
  '/set-password/:encodedToken',
  validate(setPasswordSchema),
  setPassword,
);
router.post('/login', validate(loginSchema), login);
router.post('/logout', isAuthenticated, logout);
router.post('/refresh-token', refreshToken);
router.post('/forget-password', validate(forgetPasswordSchema), forgetPassword);
router.post(
  '/change-password',
  isAuthenticated,
  validate(changePasswordSchema),
  changePassword,
);

export const authRoutes = router;
