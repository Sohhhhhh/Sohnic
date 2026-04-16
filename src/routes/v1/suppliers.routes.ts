import { Router } from 'express';

import { idSchema } from '../../dtos/common/id.dto';
import validate from '../../middlewares/validate';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { updateSupplierSchema } from '../../dtos/suppliers/updateSupplier.dto';
import { createSupplierSchema } from '../../dtos/suppliers/createSupplier.dto';
import { isAuthenticated } from '../../containers/middleware.container';
import { suppliersController } from '../../containers/suppliers.container';

const router = Router();
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
router.post(
  '/:id/deactivate',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validate(idSchema),
  suppliersController.deactivate,
);
router.post(
  '/:id/activate',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validate(idSchema),
  suppliersController.activate,
);
export const suppliersRoutes = router;
