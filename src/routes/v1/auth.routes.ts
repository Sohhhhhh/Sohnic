import { Router } from 'express';
import {
  createUser,
  setPassword,
  forgetPassword,
  changePassword,
  login,
  logout,
  // refreshToken,
} from '../../controllers/auth.controller';
import validate from '../../middlewares/validate';
import { loginSchema } from '../../dtos/login.dto';
import { createUserSchema } from '../../dtos/createUser.dto';
import { setPasswordSchema } from '../../dtos/setPassword.dto';
import { forgetPasswordSchema } from '../../dtos/forgetPassword.dto';
import { changePasswordSchema } from '../../dtos/changePassword.dto';

const router = Router();

router.post('/create-user', validate(createUserSchema), createUser);
router.post(
  '/set-password/:encodedToken',
  validate(setPasswordSchema),
  setPassword,
);
router.post('/logout', logout);
// router.post('/refresh-token', refreshToken);
router.post('/login', validate(loginSchema), login);
router.post('/forget-password', validate(forgetPasswordSchema), forgetPassword);
router.post('/change-password', validate(changePasswordSchema), changePassword);

export const authRoutes = router;
