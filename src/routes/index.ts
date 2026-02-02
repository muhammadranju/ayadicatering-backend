import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { CategoryRoutes } from '../app/modules/categorys/categorys.route';
import { BuildPackageRoutes } from '../app/modules/buildPackage/buildPackage.route';
import { SetPackageRoutes } from '../app/modules/setPackage/setPackage.route';
import { OrderRoutes } from '../app/modules/orders/orders.route';
import { NotifactionRoutes } from '../app/modules/notifaction/notifaction.route';
import { DeliveryTimeSlotRoutes } from '../app/modules/deliveryTimeSlot/deliveryTimeSlot.route';
import { PaymentRoutes } from '../app/modules/payments/payment.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/faq',
    route: FaqRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },

  {
    path: '/build-package',
    route: BuildPackageRoutes,
  },

  {
    path: '/set-package',
    route: SetPackageRoutes,
  },

  {
    path: '/orders',
    route: OrderRoutes,
  },

  {
    path: '/notifications',
    route: NotifactionRoutes,
  },

  {
    path: '/delivery-slots',
    route: DeliveryTimeSlotRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
