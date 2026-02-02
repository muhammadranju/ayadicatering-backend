import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';

const router = express.Router();

router.post(
  '/initiate',
  // No auth required as per requirement (guest checkout)
  validateRequest(PaymentValidation.initiatePaymentZodSchema),
  PaymentController.initiatePayment,
);

// Callback (IPN) - No auth required as it comes from PayTabs server
router.post('/ipn', PaymentController.handleIpn);

// Return URL - Redirects user
router.all('/return', PaymentController.handleReturn);

export const PaymentRoutes = router;
