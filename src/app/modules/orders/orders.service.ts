import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../types/pagination';
import { IOrder, EStatus } from './orders.interface';
import Order from './orders.model';

/**
 * Create a new order (SET_PACKAGE or BUILD_YOUR_OWN)
 */
import { Types } from 'mongoose';
import BuildPackage from '../buildPackage/buildPackage.model';
import { NotificationService } from '../notifaction/notifaction.service';

// Helper to populate addons
const populateAddons = async (order: any) => {
  if (!order.addons || !order.addons.length) return order;

  const populatedAddons = await Promise.all(
    order.addons.map(async (addon: string) => {
      // Check if it's a valid ObjectId
      if (Types.ObjectId.isValid(addon)) {
        const item = await BuildPackage.findById(addon).lean();
        return item || addon;
      }
      return addon;
    }),
  );

  return { ...order, addons: populatedAddons };
};

const createOrderToDB = async (orderData: IOrder) => {
  const order = await Order.create(orderData);

  // Create notification for admin
  await NotificationService.createNotificationToDB({
    type: 'new_order',
    message: `New order placed by ${orderData.deliveryDetails.name}`,
    isRead: false,
    data: {
      orderId: order._id,
      name: orderData.deliveryDetails.name,
      time: new Date().toISOString(), // Order placement time
      deliveryTime: `${orderData.dateTime.date} at ${orderData.dateTime.time}`,
    },
  });

  return order;
};

const getAllOrdersFromDB = async (
  paginationOptions: IPaginationOptions,
  filters?: {
    orderType?: string;
    status?: string;
    email?: string;
    startDate?: Date;
    endDate?: Date;
  },
) => {
  const {
    page,
    limit,
    skip,
    sortBy,
    sortOrder = 'desc',
  } = paginationHelper.calculatePagination(paginationOptions);

  const query: any = {};

  if (filters?.orderType) {
    query.orderType = filters.orderType;
  }

  if (filters?.status) {
    query.status = filters.status;
  }

  if (filters?.email) {
    query['deliveryDetails.email'] = filters.email;
  }

  if (filters?.startDate || filters?.endDate) {
    query['dateTime.date'] = {};
    if (filters.startDate) {
      query['dateTime.date'].$gte = filters.startDate;
    }
    if (filters.endDate) {
      query['dateTime.date'].$lte = filters.endDate;
    }
  }

  const result = await Order.find(query)
    .populate('menuSelection.salad')
    .populate('menuSelection.appetizers')
    .populate('menuSelection.mains')
    .populate('userId', 'name email')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Order.countDocuments(query);

  const dataWithAddons = await Promise.all(
    result.map(order => populateAddons(order)),
  );

  return {
    meta: {
      page,
      limit,
      total,
      sortBy,
      sortOrder,
    },
    data: dataWithAddons,
  };
};

const getSingleOrderFromDB = async (id: string) => {
  const order = await Order.findById(id)
    .populate('menuSelection.salad')
    .populate('menuSelection.appetizers')
    .populate('menuSelection.mains')
    .populate('userId', 'name email')
    .lean();

  if (!order) return null;

  return populateAddons(order);
};

const updateOrderStatusToDB = async (id: string, status: EStatus) => {
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  return order;
};

const updateOrderToDB = async (id: string, updateData: Partial<IOrder>) => {
  const order = await Order.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return order;
};

const deleteOrderFromDB = async (id: string) => {
  const order = await Order.findByIdAndDelete(id);
  return order;
};

const getOrdersByEmailFromDB = async (email: string) => {
  const orders = await Order.find({ 'deliveryDetails.email': email })
    .sort({ timestamp: -1 })
    .populate('menuSelection.salad')
    .populate('menuSelection.appetizers')
    .populate('menuSelection.mains')
    .lean();

  const ordersWithAddons = await Promise.all(
    orders.map(order => populateAddons(order)),
  );

  return ordersWithAddons;
};

const getOrderStatsFromDB = async () => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: EStatus.pending });
  const confirmedOrders = await Order.countDocuments({
    status: EStatus.confirmed,
  });
  const deliveredOrders = await Order.countDocuments({
    status: EStatus.delivered,
  });
  const cancelledOrders = await Order.countDocuments({
    status: EStatus.cancelled,
  });

  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: EStatus.cancelled } } },
    { $group: { _id: null, total: { $sum: '$pricing.total' } } },
  ]);

  return {
    totalOrders,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
  };
};

const getOrdersByDateFromDB = async (date: string) => {
  const queryDate = new Date(date);
  const startOfDay = new Date(queryDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(queryDate);
  endOfDay.setHours(23, 59, 59, 999);

  const orders = await Order.find({
    'dateTime.date': {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  })
    .populate('menuSelection.salad')
    .populate('menuSelection.appetizers')
    .populate('menuSelection.mains')
    .populate('userId', 'name email')
    .lean();

  const ordersWithAddons = await Promise.all(
    orders.map(order => populateAddons(order)),
  );

  return {
    date,
    total: ordersWithAddons.length,
    data: ordersWithAddons,
  };
};

const getRevenueAnalyticsFromDB = async (year: number) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  const result = await Order.aggregate([
    {
      $match: {
        'dateTime.date': { $gte: startDate, $lte: endDate },
        status: { $ne: EStatus.cancelled },
      },
    },
    {
      $group: {
        _id: { $month: '$dateTime.date' },
        totalRevenue: { $sum: '$pricing.total' },
      },
    },
  ]);

  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

  const formattedData = months.map((month, index) => {
    const monthData = result.find(item => item._id === index + 1);
    return {
      name: month,
      value: monthData ? monthData.totalRevenue : 0,
    };
  });

  return formattedData;
};

export const OrderService = {
  createOrderToDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderStatusToDB,
  updateOrderToDB,
  deleteOrderFromDB,
  getOrdersByEmailFromDB,
  getOrderStatsFromDB,
  getOrdersByDateFromDB,
  getRevenueAnalyticsFromDB,
};
