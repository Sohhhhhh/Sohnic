import { Router } from 'express';
import validate from '../../middlewares/validate';
import { createUserSchema } from '../../dtos/createUser.dto';
import { setPasswordSchema } from '../../dtos/setPassword.dto';
import { createUser, setPassword } from '../../controllers/auth.controller';

const router = Router();

router.post('/create-user', validate(createUserSchema), createUser);
router.post(
  '/set-password/:encodedToken',
  validate(setPasswordSchema),
  setPassword,
);
// router.post('/login', login);

export const authRoutes = router;
