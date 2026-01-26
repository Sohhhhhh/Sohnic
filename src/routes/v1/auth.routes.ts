import { Router } from 'express';
import { createUser } from '../../controllers/auth.controller';

const router = Router();

router.post('/create-user', createUser);
// router.post('/login', login);

export const authRoutes = router;
