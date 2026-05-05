import { RequestHandler, Router } from 'express';

import { validateId } from '../../validators/common.validator';
import {
  validateCreateSupplier,
  validateUpdateSupplier,
  validateAddItemSupplier,
  validateFilterSuppliers,
  validateEditItemSupplier,
  validateItemSuppliersQuery,
} from '../../validators/suppliers.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { suppliersController } from '../../containers/suppliers.container';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateCreateSupplier,
  suppliersController.create,
);
router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'storage_manager'),
  validateFilterSuppliers,
  suppliersController.findAll,
);
router.get(
  '/items',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateItemSuppliersQuery,
  suppliersController.getAllItemsSuppliers as unknown as RequestHandler,
);
router.get(
  '/items/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant', 'branch_admin'),
  validateId,
  validateItemSuppliersQuery,
  suppliersController.getItemSuppliers as unknown as RequestHandler,
);

router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'storage_manager'),
  validateId,
  suppliersController.findOne,
);
router.patch(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  validateUpdateSupplier,
  suppliersController.update,
);
router.patch(
  '/:id/deactivate',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  suppliersController.deactivate,
);
router.patch(
  '/:id/activate',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  suppliersController.activate,
);

router.post(
  '/:id/items',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateId,
  validateAddItemSupplier,
  suppliersController.addItemSupplier,
);

router.patch(
  '/items/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateId,
  validateEditItemSupplier,
  suppliersController.editItemSupplier,
);

router.delete(
  '/items/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateId,
  suppliersController.deleteItemSupplier,
);

router.patch(
  '/items/:id/primary',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateId,
  suppliersController.makePrimary,
);

router.patch(
  '/items/:id/unprimary',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validateId,
  suppliersController.removePrimary,
);

export const suppliersRoutes = router;
