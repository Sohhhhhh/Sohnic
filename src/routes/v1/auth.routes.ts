import { Router } from 'express';
import { createUser } from '../../controllers/auth.controller';
import validate from '../../middlewares/validate';
import { createUserSchema } from '../../dtos/createUser.dto';

const router = Router();

router.post('/create-user', validate(createUserSchema), createUser);
// router.post('/login', login);

export const authRoutes = router;
