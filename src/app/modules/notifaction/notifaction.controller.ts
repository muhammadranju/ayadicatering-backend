import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import { NotificationService } from './notifaction.service';
import { IPaginationOptions } from '../../../types/pagination';
import pick from '../../../shared/pick';

const getAllNotificationController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, [
      'page',
      'limit',
      'sortBy',
      'sortOrder',
    ]);
    const result = await NotificationService.getAllNotificationFromDB(
      paginationOptions as IPaginationOptions,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Notification fetched successfully',
      data: result,
    });
  },
);

const updateNotificationController = catchAsync(
  async (req: Request, res: Response) => {
    const { ...data } = req.body;
    const result = await NotificationService.updateNotificationToDB(
      req.params.id as string,
      data,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Notification updated successfully',
      data: result,
    });
  },
);

const deleteNotificationController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await NotificationService.deleteNotificationFromDB(
      id as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Notification deleted successfully',
      data: result,
    });
  },
);

export const NotificationController = {
  getAllNotificationController,
  updateNotificationController,
  deleteNotificationController,
};
