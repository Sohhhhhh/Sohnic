import { Router } from 'express';

import validate from '../../middlewares/validate';
import { idSchema } from '../../dtos/common/id.dto';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { suppliersController } from '../../containers/suppliers.container';
import { updateSupplierSchema } from '../../dtos/suppliers/updateSupplier.dto';
import { createSupplierSchema } from '../../dtos/suppliers/createSupplier.dto';
import { addItemSupplierSchema } from '../../dtos/suppliers/addItemSupplier.dto';

const router = Router();

// suppliers
router.post(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validate(createSupplierSchema),
  suppliersController.create,
);
router.get(
  '/',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'storage_manager'),
  suppliersController.findAll,
);
router.get(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'storage_manager'),
  validate(idSchema),
  suppliersController.findOne,
);
router.patch(
  '/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validate(idSchema.merge(updateSupplierSchema)),
  suppliersController.update,
);
router.patch(
  '/:id/deactivate',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validate(idSchema),
  suppliersController.deactivate,
);
router.patch(
  '/:id/activate',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validate(idSchema),
  suppliersController.activate,
);

// item suppliers
router.post(
  '/:id/items',
  isAuthenticated,
  isAuthorized('super_admin', 'accountant'),
  validate(idSchema.merge(addItemSupplierSchema)),
  suppliersController.addItemSupplier,
);

export const suppliersRoutes = router;
