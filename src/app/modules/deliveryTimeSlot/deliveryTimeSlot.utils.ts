import { ITimeSlot } from './deliveryTimeSlot.interface';

/**
 * Generate default time slots from 9:00 AM to 9:00 PM (hourly slots)
 */
export const generateDefaultTimeSlots = (): ITimeSlot[] => {
  const slots: ITimeSlot[] = [];
  for (let hour = 9; hour < 21; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    slots.push({
      startTime,
      endTime,
      isBlocked: false,
      currentBookings: 0,
    });
  }
  return slots;
};

/**
 * Validate time format (HH:mm)
 */
export const validateTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Check if start time is before end time
 */
export const isStartTimeBeforeEndTime = (
  startTime: string,
  endTime: string,
): boolean => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  if (startHour < endHour) return true;
  if (startHour === endHour && startMinute < endMinute) return true;
  return false;
};

/**
 * Check if a date is in the past (considering only date, not time)
 */
export const isDateInPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

/**
 * Check for overlapping time slots
 */
export const checkTimeSlotOverlap = (
  slots: { startTime: string; endTime: string }[],
): boolean => {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const slot1 = slots[i];
      const slot2 = slots[j];

      const [start1Hour, start1Min] = slot1.startTime.split(':').map(Number);
      const [end1Hour, end1Min] = slot1.endTime.split(':').map(Number);
      const [start2Hour, start2Min] = slot2.startTime.split(':').map(Number);
      const [end2Hour, end2Min] = slot2.endTime.split(':').map(Number);

      const start1 = start1Hour * 60 + start1Min;
      const end1 = end1Hour * 60 + end1Min;
      const start2 = start2Hour * 60 + start2Min;
      const end2 = end2Hour * 60 + end2Min;

      // Check for overlap
      if (start1 < end2 && start2 < end1) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return new Date(startDate) <= new Date(endDate);
};

/**
 * Normalize date to start of day (remove time component)
 */
export const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};
