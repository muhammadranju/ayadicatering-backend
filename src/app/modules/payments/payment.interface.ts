import { Model, Types } from 'mongoose';

export type TPaymentStatus = 'Pending' | 'Success' | 'Failed' | 'Cancelled';

export interface IPayment {
  amount: number;
  currency: string;
  transactionId?: string;
  orderId?: Types.ObjectId; // Link to the Order
  status: TPaymentStatus;
  paymentGateway: 'PayTabs';
  description?: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  response?: any; // To store the full response from the gateway
  createdAt?: Date;
  updatedAt?: Date;
}

export type PaymentModel = Model<IPayment>;
