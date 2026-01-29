import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../types/pagination';
import { IOrder, EStatus } from './orders.interface';
import Order from './orders.model';

/**
 * Create a new order (SET_PACKAGE or BUILD_YOUR_OWN)
 */
const createOrderToDB = async (orderData: IOrder) => {
  const order = await Order.create(orderData);
  return order;
};

/**
 * Get all orders with pagination and filtering
 */
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

  // Apply filters
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
    .limit(limit);

  const total = await Order.countDocuments(query);

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
 * Get a single order by ID
 */
const getSingleOrderFromDB = async (id: string) => {
  const order = await Order.findById(id)
    .populate('menuSelection.salad')
    .populate('menuSelection.appetizers')
    .populate('menuSelection.mains')
    .populate('userId', 'name email');

  return order;
};

/**
 * Update order status
 */
const updateOrderStatusToDB = async (id: string, status: EStatus) => {
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  return order;
};

/**
 * Update entire order
 */
const updateOrderToDB = async (id: string, updateData: Partial<IOrder>) => {
  const order = await Order.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return order;
};

/**
 * Delete an order
 */
const deleteOrderFromDB = async (id: string) => {
  const order = await Order.findByIdAndDelete(id);
  return order;
};

/**
 * Get orders by email
 */
const getOrdersByEmailFromDB = async (email: string) => {
  const orders = await Order.find({ 'deliveryDetails.email': email })
    .sort({ timestamp: -1 })
    .populate('menuSelection.salad')
    .populate('menuSelection.appetizers')
    .populate('menuSelection.mains');

  return orders;
};

/**
 * Get order statistics
 */
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

/**
 * Get orders list by date
 */
const getOrdersByDateFromDB = async (date: string) => {
  const queryDate = new Date(date);

  // Set start of the day (00:00:00)
  const startOfDay = new Date(queryDate);
  startOfDay.setHours(0, 0, 0, 0);

  // Set end of the day (23:59:59)
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
    .populate('userId', 'name email');

  return {
    date,
    total: orders.length,
    data: orders,
  };
};

/**
 * Get revenue analytics (monthly)
 */
const getRevenueAnalyticsFromDB = async (year: number) => {
  const startDate = new Date(year, 0, 1); // Jan 1st
  const endDate = new Date(year, 11, 31, 23, 59, 59); // Dec 31st

  const result = await Order.aggregate([
    {
      $match: {
        'dateTime.date': { $gte: startDate, $lte: endDate },
        status: { $ne: EStatus.cancelled }, // Exclude cancelled orders
      },
    },
    {
      $group: {
        _id: { $month: '$dateTime.date' }, // 1-12
        totalRevenue: { $sum: '$pricing.total' },
      },
    },
  ]);

  // Format data for chart
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
