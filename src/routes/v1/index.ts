import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { usersRoutes } from './users.routes';
import { itemsRoutes } from './items.routes';
import { suppliersRoutes } from './suppliers.routes';
import { categoriesRoutes } from './categories.routes';
import { purchasingRoutes } from './purchasing.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/items', itemsRoutes);
router.use('/suppliers', suppliersRoutes);
router.use('/categories', categoriesRoutes);
router.use('/purchasing', purchasingRoutes);

export const v1Routes = router;
