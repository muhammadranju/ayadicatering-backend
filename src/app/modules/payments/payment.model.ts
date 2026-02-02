import { Schema, model } from 'mongoose';
import { IPayment, PaymentModel } from './payment.interface';

const paymentSchema = new Schema<IPayment, PaymentModel>(
  {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'SAR',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined to not violate uniqueness
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    status: {
      type: String,
      enum: ['Pending', 'Success', 'Failed', 'Cancelled'],
      default: 'Pending',
    },
    paymentGateway: {
      type: String,
      enum: ['PayTabs'],
      default: 'PayTabs',
    },
    description: {
      type: String,
    },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zip: { type: String },
    },
    response: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

export const Payment = model<IPayment, PaymentModel>('Payment', paymentSchema);
