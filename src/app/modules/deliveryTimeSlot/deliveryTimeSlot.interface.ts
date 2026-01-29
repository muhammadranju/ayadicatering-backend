import { Types } from 'mongoose';

export interface ITimeSlot {
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  isBlocked: boolean;
  blockedReason?: string;
  maxCapacity?: number;
  currentBookings: number;
}

interface IDeliveryTimeSlot {
  date: Date;
  timeSlots: ITimeSlot[];
  isFullDayBlocked: boolean;
  blockedReason?: string;
  createdBy?: Types.ObjectId;
}

export default IDeliveryTimeSlot;
