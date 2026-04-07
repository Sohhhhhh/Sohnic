import { Router } from 'express';

import { idSchema } from '../../dtos/id.dto';
import validate from '../../middlewares/validate';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { createSupplierSchema } from '../../dtos/createSupplier.dto';
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

export const suppliersRoutes = router;
