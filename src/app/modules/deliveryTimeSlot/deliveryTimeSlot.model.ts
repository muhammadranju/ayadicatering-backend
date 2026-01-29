import IDeliveryTimeSlot from './deliveryTimeSlot.interface';
import { Schema, model } from 'mongoose';

const timeSlotSchema = new Schema(
  {
    startTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedReason: {
      type: String,
    },
    maxCapacity: {
      type: Number,
    },
    currentBookings: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const deliveryTimeSlotSchema = new Schema<IDeliveryTimeSlot>(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    timeSlots: {
      type: [timeSlotSchema],
      default: [],
    },
    isFullDayBlocked: {
      type: Boolean,
      default: false,
    },
    blockedReason: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient queries
deliveryTimeSlotSchema.index({ date: 1, 'timeSlots.startTime': 1 });

const DeliveryTimeSlot = model<IDeliveryTimeSlot>(
  'DeliveryTimeSlot',
  deliveryTimeSlotSchema,
);

export default DeliveryTimeSlot;
