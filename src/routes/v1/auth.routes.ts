import { Router } from 'express';
import {
  createUser,
  setPassword,
  forgetPassword,
  changePassword,
} from '../../controllers/auth.controller';
import validate from '../../middlewares/validate';
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
router.post('/forget-password', validate(forgetPasswordSchema), forgetPassword);
router.post('/change-password', validate(changePasswordSchema), changePassword);
// router.post('/login', login);

export const authRoutes = router;
