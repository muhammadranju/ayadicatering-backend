import { Schema, model } from 'mongoose';
import { INotification } from './notifaction.interface';

const notifactionSchema = new Schema<INotification>(
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

const Notifaction = model<INotification>('Notifaction', notifactionSchema);

export default Notifaction;
