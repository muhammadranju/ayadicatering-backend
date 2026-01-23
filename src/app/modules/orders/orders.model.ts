import { Schema, model } from 'mongoose';
import IOrder from './orders.interface';

const orderSchema = new Schema<IOrder>(
  {
    person: {
      type: String,
      required: true,
    },

    menu: {
      type: String,
      required: true,
    },
    guest: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    items: {
      type: [String],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'in_progress',
    },
  },
  {
    timestamps: true,
  },
);

const Order = model<IOrder>('Order', orderSchema);

export default Order;
