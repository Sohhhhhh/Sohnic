import { Router } from 'express';
import { isAuthenticated } from '../../containers/middleware.container';
import { isAuthorized } from '../../middlewares/isAuthorized';
import validate from '../../middlewares/validate';
import { suppliersController } from '../../containers/suppliers.container';
import { createSupplierSchema } from '../../dtos/createSupplier.dto';

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

export const suppliersRoutes = router;
