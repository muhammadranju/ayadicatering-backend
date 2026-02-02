import express from 'express';
import { NotificationController } from './notifaction.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.patch(
  '/mark-as-read',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  NotificationController.markAllAsReadController,
);

router
  .route('/')
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    NotificationController.getAllNotificationController,
  );
router
  .route('/:id')
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    NotificationController.updateNotificationController,
  );
router
  .route('/:id')
  .delete(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    NotificationController.deleteNotificationController,
  );

export const NotifactionRoutes = router;
