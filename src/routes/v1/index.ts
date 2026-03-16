import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { usersRoutes } from './users.routes';
import { suppliersRoutes } from './suppliers.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/suppliers', suppliersRoutes);

export const v1Routes = router;
