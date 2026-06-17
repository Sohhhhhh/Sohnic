import { Router } from 'express';

import {
  validateId,
  validatePagination,
  validateIdAndQuotationId,
} from '../../validators/common.validator';
import {
  validateCreatePurchaseOrder,
  validateCreatePurchaseRequest,
  validateRejectPurchaseRequest,
  validateFilterPurchaseRequests,
  validateCreateSupplierQuotation,
  validateFilterPurchaseOrders,
} from '../../validators/purchasing.validator';
import { isAuthorized } from '../../middlewares/isAuthorized';
import { isAuthenticated } from '../../containers/middleware.container';
import { purchasingController } from '../../containers/purchasing.container';

const router = Router();

// PURCHASE REQS

router.post(
  '/requests',
  isAuthenticated,
  isAuthorized('accountant', 'storage_manager', 'super_admin'),
  validateCreatePurchaseRequest,
  purchasingController.createPurchaseRequest,
);

router.get(
  '/requests',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateFilterPurchaseRequests,
  purchasingController.getAllPurchaseRequests,
);

router.get(
  '/requests/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  purchasingController.getPurchaseRequest,
);

router.patch(
  '/requests/:id/approve',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  purchasingController.approvePurchaseRequest,
);

router.patch(
  '/requests/:id/reject',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  validateRejectPurchaseRequest,
  purchasingController.rejectPurchaseRequest,
);

// QUOTATIONS

router.post(
  '/:id/quotations',
  isAuthenticated,
  isAuthorized('accountant', 'super_admin'),
  validateId,
  validateCreateSupplierQuotation,
  purchasingController.createSupplierQuotation,
);

router.get(
  '/:id/quotations/:quotationId',
  isAuthenticated,
  isAuthorized('branch_admin', 'accountant', 'super_admin'),
  validateIdAndQuotationId,
  purchasingController.getQuotation,
);

router.get(
  '/:id/quotations',
  isAuthenticated,
  isAuthorized('branch_admin', 'accountant', 'super_admin'),
  validateId,
  validatePagination,
  purchasingController.getPurchReqQuotations,
);

// PURCHASE ORDERS

router.post(
  '/orders',
  isAuthenticated,
  isAuthorized('accountant', 'super_admin'),
  validateCreatePurchaseOrder,
  purchasingController.createPurchaseOrder,
);

router.get(
  '/orders',
  isAuthenticated,
  isAuthorized('accountant', 'super_admin'),
  validateFilterPurchaseOrders,
  purchasingController.getAllPurchaseOrders,
);

router.get(
  '/orders/:id',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin', 'accountant'),
  validateId,
  purchasingController.getPurchaseOrder,
);

router.patch(
  '/orders/:id/approve',
  isAuthenticated,
  isAuthorized('super_admin', 'branch_admin'),
  validateId,
  purchasingController.approvePurchaseOrder,
);

export const purchasingRoutes = router;
