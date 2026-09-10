import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { usersRoutes } from './users.routes';
import { itemsRoutes } from './items.routes';
import { returnsRoutes } from './returns.routes';
import { suppliersRoutes } from './suppliers.routes';
import { categoriesRoutes } from './categories.routes';
import { purchasingRoutes } from './purchasing.routes';
import { inspectionsRoutes } from './inspections.routes';
import { manufacturersRoutes } from './manufacturers.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/items', itemsRoutes);
router.use('/returns', returnsRoutes);
router.use('/suppliers', suppliersRoutes);
router.use('/categories', categoriesRoutes);
router.use('/purchasing', purchasingRoutes);
router.use('/inspections', inspectionsRoutes);
router.use('/manufacturers', manufacturersRoutes);

export const v1Routes = router;
