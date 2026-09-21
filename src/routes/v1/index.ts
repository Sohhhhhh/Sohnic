import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { usersRoutes } from './users.routes';
import { itemsRoutes } from './items.routes';
import { returnsRoutes } from './returns.routes';
import { transfersRoutes } from './transfers.routes';
import { inventoryRoutes } from './inventory.routes';
import { suppliersRoutes } from './suppliers.routes';
import { categoriesRoutes } from './categories.routes';
import { purchasingRoutes } from './purchasing.routes';
import { inspectionsRoutes } from './inspections.routes';
import { manufacturersRoutes } from './manufacturers.routes';
import { manufacturingOrdersRoutes } from './manufacturing-orders.routes';
import { salesRoutes } from './sales.routes';
import { customersRoutes } from './customers.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/items', itemsRoutes);
router.use('/sales', salesRoutes);
router.use('/returns', returnsRoutes);
router.use('/customers', customersRoutes);
router.use('/transfers', transfersRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/suppliers', suppliersRoutes);
router.use('/categories', categoriesRoutes);
router.use('/purchasing', purchasingRoutes);
router.use('/inspections', inspectionsRoutes);
router.use('/manufacturers', manufacturersRoutes);
router.use('/manufacturing-orders', manufacturingOrdersRoutes);

export const v1Routes = router;
