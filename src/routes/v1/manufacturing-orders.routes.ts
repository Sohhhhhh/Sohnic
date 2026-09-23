import { Router } from 'express';

import {
  validateCreateManufacturingOrder,
  validateFilterManufacturingOrders,
  validateRejectManufacturingOrders,
} from '../../validators/manufacturing-orders.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { validateId, validatePagination } from '../../validators/common.validator';
import { validateCreateManufacturingBatch } from '../../validators/manufacturing-batches.validator';
import { isAuthenticated } from '../../containers/middleware.container';
import { manufacturingOrdersController } from '../../containers/manufacturing-orders.container';
import { manufacturingBatchesController } from '../../containers/manufacturing-batches.container';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('accountant', 'super_admin'),
  validateCreateManufacturingOrder,
  manufacturingOrdersController.create,
);

router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'accountant', 'storage_manager'),
  validateFilterManufacturingOrders,
  manufacturingOrdersController.findAll,
);

router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'accountant', 'storage_manager'),
  validateId,
  manufacturingOrdersController.findOne,
);

router.patch(
  '/:id/approve',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  manufacturingOrdersController.approve,
);

router.patch(
  '/:id/reject',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  validateRejectManufacturingOrders,
  manufacturingOrdersController.reject,
);

router.patch(
  '/:id/send-materials',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager'),
  validateId,
  manufacturingOrdersController.sendMaterials,
);

router.patch(
  '/:id/start-production',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager'),
  validateId,
  manufacturingOrdersController.startProduction,
);

router.patch(
  '/:id/complete',
  isAuthenticated,
  isAuthorized('super_admin', 'storage_manager'),
  validateId,
  manufacturingOrdersController.complete,
);

router.patch(
  '/:id/cancel',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  manufacturingOrdersController.cancel,
);

router.post(
  '/:id/batches',
  isAuthenticated,
  isAuthorized('storage_manager', 'super_admin'),
  validateId,
  validateCreateManufacturingBatch,
  manufacturingBatchesController.create,
);

router.get(
  '/:id/batches',
  isAuthenticated,
  isAuthorized(
    'super_admin',
    'branch_admin',
    'storage_manager',
    'accountant',
  ),
  validateId,
  validatePagination,
  manufacturingBatchesController.findByOrder,
);

router.get(
  '/batches/:id',
  isAuthenticated,
  isAuthorized(
    'super_admin',
    'branch_admin',
    'storage_manager',
    'accountant',
  ),
  validateId,
  manufacturingBatchesController.findOne,
);

export const manufacturingOrdersRoutes = router;
