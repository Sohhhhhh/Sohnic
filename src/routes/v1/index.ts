import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { usersRoutes } from './users.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

export const v1Routes = router;
