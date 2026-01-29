import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IPaginationOptions } from '../../../types/pagination';
import { DeliveryTimeSlotService } from './deliveryTimeSlot.service';

/**
 * Block a full date
 */
const blockFullDateController = catchAsync(
  async (req: Request, res: Response) => {
    const { date, reason } = req.body;
    const userId = req.user?.userId;

    const result = await DeliveryTimeSlotService.blockFullDateInDB(
      new Date(date),
      reason,
      userId,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Date blocked successfully',
      data: result,
    });
  },
);

/**
 * Block specific time slots
 */
const blockTimeSlotsController = catchAsync(
  async (req: Request, res: Response) => {
    const { date, timeSlots } = req.body;
    const userId = req.user?.userId;

    const result = await DeliveryTimeSlotService.blockTimeSlotsInDB(
      new Date(date),
      timeSlots,
      userId,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Time slots blocked successfully',
      data: result,
    });
  },
);

/**
 * Unblock a full date
 */
const unblockDateController = catchAsync(
  async (req: Request, res: Response) => {
    const { date } = req.body;

    const result = await DeliveryTimeSlotService.unblockDateInDB(
      new Date(date),
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Date unblocked successfully',
      data: result,
    });
  },
);

/**
 * Unblock specific time slots
 */
const unblockTimeSlotsController = catchAsync(
  async (req: Request, res: Response) => {
    const { date, timeSlots } = req.body;

    const result = await DeliveryTimeSlotService.unblockTimeSlotsInDB(
      new Date(date),
      timeSlots,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Time slots unblocked successfully',
      data: result,
    });
  },
);

/**
 * Get blocked dates within a date range
 */
const getBlockedDatesController = catchAsync(
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    const result = await DeliveryTimeSlotService.getBlockedDatesFromDB(
      new Date(startDate as string),
      new Date(endDate as string),
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Blocked dates retrieved successfully',
      data: result,
    });
  },
);

/**
 * Get available time slots
 */
const getAvailableTimeSlotsController = catchAsync(
  async (req: Request, res: Response) => {
    const { date, startDate, endDate } = req.query;

    const result = await DeliveryTimeSlotService.getAvailableTimeSlotsFromDB(
      date ? new Date(date as string) : undefined,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Available time slots retrieved successfully',
      data: result,
    });
  },
);

/**
 * Get all delivery slots with pagination (Admin)
 */
const getAllDeliverySlotsController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, [
      'page',
      'limit',
      'sortBy',
      'sortOrder',
    ]);

    const filters = pick(req.query, ['startDate', 'endDate', 'isBlocked']);

    // Convert string filters to proper types
    const processedFilters: any = {};
    if (filters.startDate) {
      processedFilters.startDate = new Date(filters.startDate as string);
    }
    if (filters.endDate) {
      processedFilters.endDate = new Date(filters.endDate as string);
    }
    if (filters.isBlocked !== undefined) {
      processedFilters.isBlocked = filters.isBlocked === 'true';
    }

    const result = await DeliveryTimeSlotService.getAllDeliverySlotsFromDB(
      paginationOptions as IPaginationOptions,
      processedFilters,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Delivery slots retrieved successfully',
      data: result,
    });
  },
);

/**
 * Create default time slots for a date
 */
const createDefaultTimeSlotsController = catchAsync(
  async (req: Request, res: Response) => {
    const { date, defaultSlots } = req.body;
    const userId = req.user?.userId;

    const result = await DeliveryTimeSlotService.createDefaultTimeSlotsInDB(
      new Date(date),
      userId,
      defaultSlots,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Default time slots created successfully',
      data: result,
    });
  },
);

/**
 * Bulk block multiple dates
 */
const bulkBlockDatesController = catchAsync(
  async (req: Request, res: Response) => {
    const { dates, reason } = req.body;
    const userId = req.user?.userId;

    const dateObjects = dates.map((d: string) => new Date(d));

    const result = await DeliveryTimeSlotService.bulkBlockDatesInDB(
      dateObjects,
      reason,
      userId,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: result.message,
      data: result.data,
    });
  },
);

export const DeliveryTimeSlotController = {
  blockFullDateController,
  blockTimeSlotsController,
  unblockDateController,
  unblockTimeSlotsController,
  getBlockedDatesController,
  getAvailableTimeSlotsController,
  getAllDeliverySlotsController,
  createDefaultTimeSlotsController,
  bulkBlockDatesController,
};
