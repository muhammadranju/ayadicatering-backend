import { Schema, model } from 'mongoose';
import {
  IOrder,
  EStatus,
  EOrderType,
  EPaymentMethod,
} from './orders.interface';

// Sub-schema for Date Time
const dateTimeSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

// Sub-schema for Delivery Details
const deliveryDetailsSchema = new Schema(
  {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
  },
  { _id: false },
);

// Sub-schema for Pricing
const pricingSchema = new Schema(
  {
    basePrice: {
      type: Number,
      required: true,
    },
    addonsPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    vat: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

// Sub-schema for Menu Selection (BUILD_YOUR_OWN)
const menuSelectionSchema = new Schema(
  {
    salad: {
      type: Schema.Types.ObjectId,
      ref: 'BuildPackage',
    },
    appetizers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'BuildPackage',
      },
    ],
    mains: [
      {
        type: Schema.Types.ObjectId,
        ref: 'BuildPackage',
      },
    ],
  },
  { _id: false },
);

// Main Order Schema
const orderSchema = new Schema<IOrder>(
  {
    orderType: {
      type: String,
      enum: Object.values(EOrderType),
      required: true,
    },

    // For SET_PACKAGE orders - store the full package data as embedded document
    selectedPackage: {
      type: Schema.Types.Mixed,
      required: function (this: IOrder) {
        return this.orderType === EOrderType.SET_PACKAGE;
      },
    },

    // For BUILD_YOUR_OWN orders - references to BuildPackage items
    menuSelection: {
      type: menuSelectionSchema,
      required: function (this: IOrder) {
        return this.orderType === EOrderType.BUILD_YOUR_OWN;
      },
    },

    // Add-ons (can be IDs or static strings)
    addons: {
      type: [String],
      default: [],
    },

    // Date and time for delivery
    dateTime: {
      type: dateTimeSchema,
      required: true,
    },

    // Delivery address and contact details
    deliveryDetails: {
      type: deliveryDetailsSchema,
      required: true,
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: Object.values(EPaymentMethod),
      required: true,
    },

    // Pricing breakdown
    pricing: {
      type: pricingSchema,
      required: true,
    },

    // Order status
    status: {
      type: String,
      enum: Object.values(EStatus),
      default: EStatus.pending,
    },

    // Optional user reference
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    // Timestamp (frontend sends this)
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt
  },
);

// Indexes for better query performance
orderSchema.index({ orderType: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'dateTime.date': 1 });
orderSchema.index({ 'deliveryDetails.email': 1 });
orderSchema.index({ timestamp: -1 });

const Order = model<IOrder>('Order', orderSchema);

export default Order;
