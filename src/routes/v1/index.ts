import { Router } from 'express';
import { authRoutes } from './auth.routes';

const router = Router();
router.use('/auth', authRoutes);

export const v1Routes = router;
