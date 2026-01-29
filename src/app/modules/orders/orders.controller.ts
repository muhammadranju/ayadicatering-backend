import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { IPaginationOptions } from '../../../types/pagination';
import { OrderService } from './orders.service';
import { EStatus } from './orders.interface';

/**
 * Create a new order
 */
const createOrderController = catchAsync(
  async (req: Request, res: Response) => {
    const orderData = req.body;

    // Optionally attach user ID if authenticated
    if (req.user?.userId) {
      orderData.userId = req.user.userId;
    }

    // SANITIZATION: Fix for Build Your Own package data format issues
    // The frontend sends full objects or stringified arrays, but generic ObjectIds are expected
    if (orderData.menuSelection) {
      // 1. Handle Salad (Object -> ID)
      if (
        typeof orderData.menuSelection.salad === 'object' &&
        orderData.menuSelection.salad !== null
      ) {
        orderData.menuSelection.salad =
          orderData.menuSelection.salad.id || orderData.menuSelection.salad._id;
      }

      // 2. Handle Appetizers (String/Array -> Array of IDs)
      if (typeof orderData.menuSelection.appetizers === 'string') {
        try {
          const parsed = JSON.parse(orderData.menuSelection.appetizers);
          orderData.menuSelection.appetizers = parsed.map(
            (item: any) => item.id || item._id || item,
          );
        } catch (error) {
          // If parsing fails, leave as is (validation will catch it)
        }
      } else if (Array.isArray(orderData.menuSelection.appetizers)) {
        orderData.menuSelection.appetizers =
          orderData.menuSelection.appetizers.map((item: any) =>
            typeof item === 'object' ? item.id || item._id || item : item,
          );
      }

      // 3. Handle Mains (String/Array -> Array of IDs)
      if (typeof orderData.menuSelection.mains === 'string') {
        try {
          const parsed = JSON.parse(orderData.menuSelection.mains);
          orderData.menuSelection.mains = parsed.map(
            (item: any) => item.id || item._id || item,
          );
        } catch (error) {
          // If parsing fails, leave as is
        }
      } else if (Array.isArray(orderData.menuSelection.mains)) {
        orderData.menuSelection.mains = orderData.menuSelection.mains.map(
          (item: any) =>
            typeof item === 'object' ? item.id || item._id || item : item,
        );
      }
    }

    const result = await OrderService.createOrderToDB(orderData);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Order created successfully',
      data: result,
    });
  },
);

/**
 * Get all orders (with pagination and filters)
 */
const getAllOrdersController = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, [
      'page',
      'limit',
      'sortBy',
      'sortOrder',
    ]);

    const filters = pick(req.query, [
      'orderType',
      'status',
      'email',
      'startDate',
      'endDate',
    ]);

    // Convert date strings to Date objects
    const processedFilters: any = { ...filters };
    if (filters.startDate) {
      processedFilters.startDate = new Date(filters.startDate as string);
    }
    if (filters.endDate) {
      processedFilters.endDate = new Date(filters.endDate as string);
    }

    const result = await OrderService.getAllOrdersFromDB(
      paginationOptions as IPaginationOptions,
      processedFilters,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Orders retrieved successfully',
      data: result,
    });
  },
);

/**
 * Get a single order by ID
 */
const getSingleOrderController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OrderService.getSingleOrderFromDB(id as string);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Order retrieved successfully',
      data: result,
    });
  },
);

/**
 * Update order status
 */
const updateOrderStatusController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await OrderService.updateOrderStatusToDB(
      id as string,
      status as EStatus,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Order status updated successfully',
      data: result,
    });
  },
);

/**
 * Update entire order
 */
const updateOrderController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const result = await OrderService.updateOrderToDB(id as string, updateData);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Order updated successfully',
      data: result,
    });
  },
);

/**
 * Delete an order
 */
const deleteOrderController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OrderService.deleteOrderFromDB(id as string);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Order deleted successfully',
      data: result,
    });
  },
);

/**
 * Get orders by email
 */
const getOrdersByEmailController = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.query;
    const result = await OrderService.getOrdersByEmailFromDB(email as string);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Orders retrieved successfully',
      data: result,
    });
  },
);

/**
 * Get order statistics
 */
const getOrderStatsController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderService.getOrderStatsFromDB();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Order statistics retrieved successfully',
      data: result,
    });
  },
);

/**
 * Get orders list by date
 */
const getOrdersByDateController = catchAsync(
  async (req: Request, res: Response) => {
    const { date } = req.query;

    if (!date) {
      throw new Error('Date is required');
    }

    const result = await OrderService.getOrdersByDateFromDB(date as string);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Orders retrieved successfully',
      data: result,
    });
  },
);

/**
 * Get revenue analytics (monthly)
 */
const getRevenueAnalyticsController = catchAsync(
  async (req: Request, res: Response) => {
    const year = Number(req.query.year) || new Date().getFullYear();

    const result = await OrderService.getRevenueAnalyticsFromDB(year);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Revenue analytics retrieved successfully',
      data: result,
    });
  },
);

export const OrderController = {
  createOrderController,
  getAllOrdersController,
  getSingleOrderController,
  updateOrderStatusController,
  updateOrderController,
  deleteOrderController,
  getOrdersByEmailController,
  getOrderStatsController,
  getOrdersByDateController,
  getRevenueAnalyticsController,
};
