import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderController } from './orders.controller';
import {
  createOrderValidation,
  updateOrderStatusValidation,
  updateOrderValidation,
  getOrdersQueryValidation,
  getOrdersByEmailValidation,
} from './orders.validation';

const router = express.Router();

// Public route - Create order
router.post(
  '/',
  // validateRequest(createOrderValidation),
  OrderController.createOrderController,
);

// Public route - Get orders by email
router.get(
  '/by-email',
  validateRequest(getOrdersByEmailValidation),
  OrderController.getOrdersByEmailController,
);

// Admin routes - Get all orders with filters
router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  // validateRequest(getOrdersQueryValidation),
  OrderController.getAllOrdersController,
);

// Admin routes - Get order statistics
router.get(
  '/stats',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.getOrderStatsController,
);

// Admin routes - Get revenue analytics
router.get(
  '/revenue-analytics',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.getRevenueAnalyticsController,
);

// Admin routes - Get order count by date
router.get(
  '/count-by-date',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.getOrdersByDateController,
);

// Public/Admin route - Get single order by ID
router.get('/:id', OrderController.getSingleOrderController);

// Admin route - Update order status
router.patch(
  '/:id/status',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  // validateRequest(updateOrderStatusValidation),
  OrderController.updateOrderStatusController,
);

// Admin route - Update entire order
router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(updateOrderValidation),
  OrderController.updateOrderController,
);

// Admin route - Delete order
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.deleteOrderController,
);

export const OrderRoutes = router;
