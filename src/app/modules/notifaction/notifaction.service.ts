import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../types/pagination';
import { INotification } from './notifaction.interface';
import Notification from './notifaction.model';

const getAllNotificationFromDB = async (
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const result = await Notification.find()
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments();

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

const updateNotificationToDB = async (id: string, data: INotification) => {
  const result = await Notification.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
};

const deleteNotificationFromDB = async (id: string) => {
  const result = await Notification.findByIdAndDelete(id);
  return result;
};

export const NotificationService = {
  getAllNotificationFromDB,
  updateNotificationToDB,
  deleteNotificationFromDB,
};
