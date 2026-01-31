import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../types/pagination';
import IDeliveryTimeSlot, { ITimeSlot } from './deliveryTimeSlot.interface';
import DeliveryTimeSlot from './deliveryTimeSlot.model';
import {
  checkTimeSlotOverlap,
  generateDefaultTimeSlots,
  isDateInPast,
  isSlotOverlapping,
  isStartTimeBeforeEndTime,
  normalizeDate,
  validateDateRange,
  validateTimeFormat,
} from './deliveryTimeSlot.utils';

/**
 * Block a full date
 */
const blockFullDateInDB = async (
  date: Date,
  reason: string,
  userId: string,
) => {
  // Validate date is not in the past
  if (isDateInPast(date)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot block dates in the past',
    );
  }

  const normalizedDate = normalizeDate(date);

  // Find or create the delivery slot for this date
  let deliverySlot = await DeliveryTimeSlot.findOne({ date: normalizedDate });

  if (!deliverySlot) {
    // Create new slot with default time slots
    const defaultSlots = generateDefaultTimeSlots();
    deliverySlot = new DeliveryTimeSlot({
      date: normalizedDate,
      timeSlots: defaultSlots,
      createdBy: userId,
    });
  }

  // Block all time slots
  deliverySlot.timeSlots = deliverySlot.timeSlots.map(slot => ({
    ...slot,
    isBlocked: true,
    blockedReason: reason,
  }));

  deliverySlot.isFullDayBlocked = true;
  deliverySlot.blockedReason = reason;

  const result = await deliverySlot.save();
  return result;
};

/**
 * Block specific time slots
 */
const blockTimeSlotsInDB = async (
  date: Date,
  timeSlots: { startTime: string; endTime: string; reason?: string }[],
  userId: string,
) => {
  // Validate date is not in the past
  if (isDateInPast(date)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot block dates in the past',
    );
  }

  // Validate time formats
  for (const slot of timeSlots) {
    if (
      !validateTimeFormat(slot.startTime) ||
      !validateTimeFormat(slot.endTime)
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Invalid time format. Use HH:mm format`,
      );
    }

    if (!isStartTimeBeforeEndTime(slot.startTime, slot.endTime)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Start time must be before end time for slot ${slot.startTime}-${slot.endTime}`,
      );
    }
  }

  // Check for overlapping slots
  if (checkTimeSlotOverlap(timeSlots)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Time slots cannot overlap');
  }

  const normalizedDate = normalizeDate(date);

  // Find or create the delivery slot for this date
  let deliverySlot = await DeliveryTimeSlot.findOne({ date: normalizedDate });

  if (!deliverySlot) {
    // Create new slot with default time slots
    const defaultSlots = generateDefaultTimeSlots();
    deliverySlot = new DeliveryTimeSlot({
      date: normalizedDate,
      timeSlots: defaultSlots,
      createdBy: userId,
    });
  }

  // Block the specified time slots
  for (const newSlot of timeSlots) {
    let hasOverlap = false;

    // Check against existing slots
    deliverySlot.timeSlots.forEach(slot => {
      if (isSlotOverlapping(slot, newSlot)) {
        slot.isBlocked = true;
        slot.blockedReason = newSlot.reason || 'Blocked';
        hasOverlap = true;
      }
    });

    if (!hasOverlap) {
      // Add new slot only if it doesn't overlap with any existing slot
      deliverySlot.timeSlots.push({
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        isBlocked: true,
        blockedReason: newSlot.reason || 'Blocked',
        currentBookings: 0,
      });
    }
  }

  const result = await deliverySlot.save();
  return result;
};

/**
 * Unblock a full date
 */
const unblockDateInDB = async (date: Date) => {
  const normalizedDate = normalizeDate(date);

  const deliverySlot = await DeliveryTimeSlot.findOne({ date: normalizedDate });

  if (!deliverySlot) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'No delivery slot found for this date',
    );
  }

  // Unblock all time slots
  deliverySlot.timeSlots = deliverySlot.timeSlots.map(slot => ({
    ...slot,
    isBlocked: false,
    blockedReason: undefined,
  }));

  deliverySlot.isFullDayBlocked = false;
  deliverySlot.blockedReason = undefined;

  const result = await deliverySlot.save();
  return result;
};

/**
 * Unblock specific time slots
 */
const unblockTimeSlotsInDB = async (
  date: Date,
  timeSlots: { startTime: string; endTime: string }[],
) => {
  const normalizedDate = normalizeDate(date);

  const deliverySlot = await DeliveryTimeSlot.findOne({ date: normalizedDate });

  if (!deliverySlot) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'No delivery slot found for this date',
    );
  }

  // Unblock the specified time slots
  for (const slotToUnblock of timeSlots) {
    deliverySlot.timeSlots.forEach(slot => {
      if (isSlotOverlapping(slot, slotToUnblock)) {
        slot.isBlocked = false;
        slot.blockedReason = undefined;
      }
    });
  }

  // Check if all slots are now unblocked
  const allUnblocked = deliverySlot.timeSlots.every(slot => !slot.isBlocked);
  if (allUnblocked) {
    deliverySlot.isFullDayBlocked = false;
    deliverySlot.blockedReason = undefined;
  }

  const result = await deliverySlot.save();
  return result;
};

/**
 * Get blocked dates within a date range
 */
const getBlockedDatesFromDB = async (startDate: Date, endDate: Date) => {
  if (!validateDateRange(startDate, endDate)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Start date must be before or equal to end date',
    );
  }

  const normalizedStartDate = normalizeDate(startDate);
  const normalizedEndDate = normalizeDate(endDate);

  const blockedDates = await DeliveryTimeSlot.find({
    date: {
      $gte: normalizedStartDate,
      $lte: normalizedEndDate,
    },
    isFullDayBlocked: true,
  })
    .select('date blockedReason')
    .sort({ date: 1 });

  return blockedDates;
};

/**
 * Get available time slots for a specific date or date range
 */
const getAvailableTimeSlotsFromDB = async (
  date?: Date,
  startDate?: Date,
  endDate?: Date,
) => {
  if (date) {
    // Single date query
    const normalizedDate = normalizeDate(date);
    const deliverySlot = await DeliveryTimeSlot.findOne({
      date: normalizedDate,
    });

    if (!deliverySlot) {
      // Return default slots if no record exists
      return {
        date: normalizedDate,
        timeSlots: generateDefaultTimeSlots(),
        isFullDayBlocked: false,
      };
    }

    // Filter only available slots
    const availableSlots = deliverySlot.timeSlots.filter(
      slot => !slot.isBlocked,
    );

    return {
      date: deliverySlot.date,
      timeSlots: availableSlots,
      isFullDayBlocked: deliverySlot.isFullDayBlocked,
    };
  } else if (startDate && endDate) {
    // Date range query
    if (!validateDateRange(startDate, endDate)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Start date must be before or equal to end date',
      );
    }

    const normalizedStartDate = normalizeDate(startDate);
    const normalizedEndDate = normalizeDate(endDate);

    const deliverySlots = await DeliveryTimeSlot.find({
      date: {
        $gte: normalizedStartDate,
        $lte: normalizedEndDate,
      },
    }).sort({ date: 1 });

    // Filter available slots for each date
    const result = deliverySlots.map(slot => ({
      date: slot.date,
      timeSlots: slot.timeSlots.filter(s => !s.isBlocked),
      isFullDayBlocked: slot.isFullDayBlocked,
    }));

    return result;
  } else {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Either date or both startDate and endDate must be provided',
    );
  }
};

/**
 * Get all delivery slots with pagination (Admin)
 */
const getAllDeliverySlotsFromDB = async (
  paginationOptions: IPaginationOptions,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    isBlocked?: boolean;
  },
) => {
  const {
    page,
    limit,
    skip,
    sortBy,
    sortOrder = 'asc',
  } = paginationHelper.calculatePagination(paginationOptions);

  const query: any = {};

  if (filters?.startDate || filters?.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = normalizeDate(filters.startDate);
    }
    if (filters.endDate) {
      query.date.$lte = normalizeDate(filters.endDate);
    }
  }

  if (filters?.isBlocked !== undefined) {
    query.isFullDayBlocked = filters.isBlocked;
  }

  const result = await DeliveryTimeSlot.find(query)
    .populate('createdBy', 'name email')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await DeliveryTimeSlot.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      total,
      sortBy,
      sortOrder,
    },
    data: result,
  };
};

/**
 * Create default time slots for a date
 */
const createDefaultTimeSlotsInDB = async (
  date: Date,
  userId: string,
  customSlots?: ITimeSlot[],
) => {
  if (isDateInPast(date)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot create slots for dates in the past',
    );
  }

  const normalizedDate = normalizeDate(date);

  // Check if slot already exists
  const existingSlot = await DeliveryTimeSlot.findOne({ date: normalizedDate });
  if (existingSlot) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      'Time slots already exist for this date',
    );
  }

  const slots = customSlots || generateDefaultTimeSlots();

  const deliverySlot = await DeliveryTimeSlot.create({
    date: normalizedDate,
    timeSlots: slots,
    isFullDayBlocked: false,
    createdBy: userId,
  });

  return deliverySlot;
};

/**
 * Bulk block multiple dates
 */
const bulkBlockDatesInDB = async (
  dates: Date[],
  reason: string,
  userId: string,
) => {
  // Validate all dates are not in the past
  for (const date of dates) {
    if (isDateInPast(date)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Cannot block past date: ${date}`,
      );
    }
  }

  const results = [];

  for (const date of dates) {
    const result = await blockFullDateInDB(date, reason, userId);
    results.push(result);
  }

  return {
    message: `Successfully blocked ${results.length} dates`,
    data: results,
  };
};

export const DeliveryTimeSlotService = {
  blockFullDateInDB,
  blockTimeSlotsInDB,
  unblockDateInDB,
  unblockTimeSlotsInDB,
  getBlockedDatesFromDB,
  getAvailableTimeSlotsFromDB,
  getAllDeliverySlotsFromDB,
  createDefaultTimeSlotsInDB,
  bulkBlockDatesInDB,
};
