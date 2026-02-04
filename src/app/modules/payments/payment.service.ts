/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
// @ts-ignore
import paytabs from 'paytabs_pt2';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { Payment } from './payment.model';
import Order from '../orders/orders.model';

// Configure PayTabs
paytabs.setConfig(
  config.paytabs.profile_id,
  config.paytabs.server_key,
  config.paytabs.region,
);

const initiatePayment = async (payload: {
  amount: number;
  currency?: string;
  description?: string;
  orderId?: string;
  lang?: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    region: string;
    zip: string;
  };
}) => {
  const {
    amount,
    currency = 'SAR',
    description,
    customerDetails,
    orderId,
    lang = 'en',
  } = payload;

  // Create payment record without User reference
  const payment = await Payment.create({
    amount,
    currency,
    description,
    customerDetails,
    orderId,
    status: 'Pending',
    paymentGateway: 'PayTabs',
  });

  const paymentMethods = ['all'];
  const transaction = ['sale', 'ecom'];
  const cart = [
    payment._id.toString(),
    currency,
    amount.toString(),
    description || 'Payment',
  ];
  const customer = [
    customerDetails.name,
    customerDetails.email,
    customerDetails.phone,
    customerDetails.street || 'NA',
    customerDetails.city || 'NA',
    customerDetails.state || 'NA',
    customerDetails.country || 'SA',
    customerDetails.region || 'NA',
    customerDetails.zip || '00000',
    '127.0.0.1', // IP address - ideally get from request
  ];
  const shipping = customer; // Use same for shipping

  // Note: These URLs must be accessible by PayTabs (publicly accessible) for IPN to work
  // For local development, you might need ngrok or similar.
  const urls = [
    `${config.base_url}/api/v1/payments/ipn`, // Callback (Server to Server)
    `${config.base_url}/api/v1/payments/return?id=${payment._id}`, // Return (Browser Redirect) - append ID for tracking
  ];

  return new Promise((resolve, reject) => {
    paytabs.createPaymentPage(
      paymentMethods,
      transaction,
      cart,
      customer,
      shipping,
      urls,
      lang,
      async function (response: any) {
        if (response.redirect_url) {
          // Update transaction ref
          if (response.tran_ref) {
            payment.transactionId = response.tran_ref;
            await payment.save();
          }
          resolve(response.redirect_url);
        } else {
          reject(
            new ApiError(
              httpStatus.BAD_REQUEST,
              'Payment initiation failed: ' + JSON.stringify(response),
            ),
          );
        }
      },
    );
  });
};

const handleIpn = async (payload: any) => {
  const { tran_ref, cart_id, payment_result } = payload;

  if (!cart_id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart ID missing');
  }

  const payment = await Payment.findById(cart_id);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  payment.response = payload;
  payment.transactionId = tran_ref;

  if (payment_result?.response_status === 'A') {
    payment.status = 'Success';
  } else if (payment_result?.response_status === 'C') {
    payment.status = 'Cancelled';
    // If payment is cancelled, delete the order
    if (payment.orderId) {
      await Order.findByIdAndDelete(payment.orderId);
    }
  } else {
    payment.status = 'Failed';
    // If payment failed, delete the order
    if (payment.orderId) {
      await Order.findByIdAndDelete(payment.orderId);
    }
  }

  await payment.save();
  return payment;
};

// Verify payment explicitly (can be used on return URL if needed)
const verifyPayment = async (tranRef: string) => {
  if (!tranRef) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Transaction Reference missing');
  }

  return new Promise((resolve, reject) => {
    paytabs.validatePayment(tranRef, async (response: any) => {
      try {
        const { cart_id, payment_result } = response;

        if (!cart_id) {
          // If cart_id is still missing in validation response, try to find by transactionId
          const payment = await Payment.findOne({ transactionId: tranRef });
          if (!payment) {
            reject(
              new ApiError(
                httpStatus.NOT_FOUND,
                'Payment not found even with Transaction ID',
              ),
            );
            return;
          }
          // Update payment status
          if (payment_result?.response_status === 'A') {
            payment.status = 'Success';
          } else if (payment_result?.response_status === 'C') {
            payment.status = 'Cancelled';
            // If payment is cancelled, delete the order
            if (payment.orderId) {
              await Order.findByIdAndDelete(payment.orderId);
            }
          } else {
            payment.status = 'Failed';
            // If payment failed, delete the order
            if (payment.orderId) {
              await Order.findByIdAndDelete(payment.orderId);
            }
          }
          payment.response = response;
          await payment.save();
          resolve(payment);
          return;
        }

        const payment = await Payment.findById(cart_id);
        if (!payment) {
          reject(new ApiError(httpStatus.NOT_FOUND, 'Payment not found'));
          return;
        }

        payment.response = response;
        payment.transactionId = tranRef;

        if (payment_result?.response_status === 'A') {
          payment.status = 'Success';
        } else if (payment_result?.response_status === 'C') {
          payment.status = 'Cancelled';
          // If payment is cancelled, delete the order
          if (payment.orderId) {
            await Order.findByIdAndDelete(payment.orderId);
          }
        } else {
          payment.status = 'Failed';
          // If payment failed, delete the order
          if (payment.orderId) {
            await Order.findByIdAndDelete(payment.orderId);
          }
        }

        await payment.save();
        resolve(payment);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const getPaymentById = async (id: string) => {
  return await Payment.findById(id);
};

export const PaymentService = {
  initiatePayment,
  handleIpn,
  verifyPayment,
  getPaymentById,
};
