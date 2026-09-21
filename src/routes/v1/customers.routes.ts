import { Router } from 'express';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { customersController } from '../../containers/customers.container';
import {
  validateCreateCustomer,
  validateFindCustomerByPhone,
  validateUpdateCustomer,
} from '../../validators/customers.validator';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  isAuthorized('cashier', 'branch_admin', 'super_admin'),
  validateCreateCustomer,
  customersController.create,
);

router.patch(
  '/:id',
  isAuthenticated,
  isAuthorized('cashier', 'branch_admin', 'super_admin'),
  validateUpdateCustomer,
  customersController.update,
);

router.get(
  '/by-phone',
  isAuthenticated,
  isAuthorized('cashier', 'branch_admin', 'super_admin'),
  validateFindCustomerByPhone,
  customersController.findByPhone,
);

export const customersRoutes = router;
