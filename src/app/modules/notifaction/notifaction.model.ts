import { Schema, model } from 'mongoose';

const notifactionSchema = new Schema<INotifaction>(
  {
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Notifaction = model<INotifaction>('Notifaction', notifactionSchema);

export default Notifaction;
