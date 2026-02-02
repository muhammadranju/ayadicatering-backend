import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import ApiError from '../../../errors/ApiError';
import { PaymentService } from './payment.service';

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.initiatePayment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment initiated successfully',
    data: result,
  });
});

const handleIpn = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.handleIpn(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'IPN handled successfully',
    data: result,
  });
});

const handleReturn = catchAsync(async (req: Request, res: Response) => {
  // PayTabs redirects to this URL with POST data
  // We can update the payment status here as well to be sure
  const payload = { ...req.query, ...req.body };

  // Log the payload for debugging
  console.log('Payment Return Payload:', JSON.stringify(payload, null, 2));

  let result: any;
  let paymentId: string | undefined;

  try {
    // Check for various possible parameter names
    const cartId = payload.cart_id || payload.cartId || payload.reference_id;
    const transactionRef =
      payload.tranRef || payload.tran_ref || payload.transaction_id;
    const paymentIdFromQuery = payload.id || payload.paymentId; // Check for ID we appended

    if (cartId) {
      // Ensure cartId is treated as string if it's not (though usually it is)
      const ipnPayload = { ...payload, cart_id: cartId };
      result = await PaymentService.handleIpn(ipnPayload);
      paymentId = result?._id;
    } else if (transactionRef) {
      result = await PaymentService.verifyPayment(transactionRef);
      paymentId = result?._id;
    } else if (paymentIdFromQuery) {
      // We have our own ID, let's use it to verify
      const payment = await PaymentService.getPaymentById(paymentIdFromQuery);
      if (!payment) {
        throw new Error('Payment not found');
      }
      paymentId = payment._id as any;

      // If transactionRef is missing in payload, try to use the one stored in payment
      if (payment.transactionId) {
        result = await PaymentService.verifyPayment(payment.transactionId);
      } else {
        // Should not happen if initiatePayment worked correctly
        // But if it does, we just check status
        result = payment;
      }
    } else {
      console.error('Missing payment information. Payload:', payload);
      // Instead of throwing error, redirect to fail page
      return res.redirect(
        `http://localhost:3000/payment/fail?error=missing_info`,
      );
    }

    // Redirect based on status
    if (result.status === 'Success') {
      res.redirect(`http://localhost:3000/payment/success?id=${result._id}`);
    } else {
      res.redirect(`http://localhost:3000/payment/fail?id=${result._id}`);
    }
  } catch (error) {
    console.error('Error handling payment return:', error);
    // Fallback redirect to fail page
    const query = paymentId ? `?id=${paymentId}` : '?error=processing_failed';
    res.redirect(`http://localhost:3000/payment/fail${query}`);
  }
});

export const PaymentController = {
  initiatePayment,
  handleIpn,
  handleReturn,
};
