import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DeliveryTimeSlotController } from './deliveryTimeSlot.controller';
import {
  blockFullDateValidation,
  blockTimeSlotsValidation,
  unblockDateValidation,
  unblockTimeSlotsValidation,
  bulkBlockDatesValidation,
  getBlockedDatesValidation,
  getAvailableTimeSlotsValidation,
  getAllDeliverySlotsValidation,
  createDefaultTimeSlotsValidation,
} from './deliveryTimeSlot.validation';

const router = express.Router();

// Admin routes - Block operations
router.post(
  '/block-date',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(blockFullDateValidation),
  DeliveryTimeSlotController.blockFullDateController,
);

router.post(
  '/block-time-slots',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(blockTimeSlotsValidation),
  DeliveryTimeSlotController.blockTimeSlotsController,
);

// Admin routes - Unblock operations
router.post(
  '/unblock-date',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(unblockDateValidation),
  DeliveryTimeSlotController.unblockDateController,
);

router.post(
  '/unblock-time-slots',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(unblockTimeSlotsValidation),
  DeliveryTimeSlotController.unblockTimeSlotsController,
);

// Admin routes - Bulk operations
router.post(
  '/bulk-block',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(bulkBlockDatesValidation),
  DeliveryTimeSlotController.bulkBlockDatesController,
);

// Admin routes - Create default slots
router.post(
  '/create-default',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(createDefaultTimeSlotsValidation),
  DeliveryTimeSlotController.createDefaultTimeSlotsController,
);

// Admin routes - Get all with pagination
router.get(
  '/all',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(getAllDeliverySlotsValidation),
  DeliveryTimeSlotController.getAllDeliverySlotsController,
);

// Public routes - Get blocked dates
router.get(
  '/blocked-dates',
  validateRequest(getBlockedDatesValidation),
  DeliveryTimeSlotController.getBlockedDatesController,
);

// Public routes - Get available time slots
router.get(
  '/available-time-slots',
  validateRequest(getAvailableTimeSlotsValidation),
  DeliveryTimeSlotController.getAvailableTimeSlotsController,
);

export const DeliveryTimeSlotRoutes = router;
